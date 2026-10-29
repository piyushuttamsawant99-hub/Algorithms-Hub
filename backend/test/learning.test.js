import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { curriculum, publicDay } from '../curriculum.js';
import { assessments, dailyQuizzes } from '../quiz-bank.js';

const backendDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const reservePort = () => new Promise((resolve, reject) => {
  const server = createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    server.close(error => error ? reject(error) : resolve(port));
  });
});

test('30-day progression is authenticated, sequential, persistent, and owner-scoped', async () => {
  assert.equal(curriculum.length, 30);
  assert.equal(new Set(curriculum.map(day => day.title)).size, 30);
  assert.equal(dailyQuizzes.reduce((total, quiz) => total + quiz.length, 0), 300);
  assert.ok(curriculum.every(day => {
    const lesson = publicDay(day.day);
    return !Object.hasOwn(lesson.activityValidation, 'expectedAnswer') &&
      lesson.quiz.every(question => !Object.hasOwn(question, 'answer'));
  }));
  assert.ok(curriculum.every(day => day.objectives.length > 0 && day.quiz.length >= 10));
  assert.ok(curriculum.every(day => day.quiz.every(question => question.options.length === 4 && question.explanation && question.hint)));
  assert.ok([...dailyQuizzes.flat(), ...assessments.flatMap(item => item.questions)].every(question =>
    question.options.length === new Set(question.options).size &&
    Number.isInteger(question.answer) &&
    question.answer >= 0 &&
    question.answer < question.options.length &&
    question.explanation.length >= 40 &&
    question.hint.length >= 30
  ));
  assert.equal(new Set(dailyQuizzes.flat().map(question => question.id)).size, 300);
  assert.deepEqual(assessments.map(item => item.id), ['foundation', 'sorting', 'graphs', 'final']);
  const dailyPrompts = new Set(dailyQuizzes.flat().map(question => question.prompt));
  assert.ok(assessments.every(item => item.questions.length === 10 &&
    new Set(item.questions.map(question => question.prompt)).size === item.questions.length &&
    item.questions.every(question => !dailyPrompts.has(question.prompt))
  ));
  assert.equal(new Set(assessments.flatMap(item => item.questions.map(question => question.prompt))).size, 40);
  assert.deepEqual(assessments.map(item => item.days[item.days.length - 1]), [7, 14, 21, 30]);
  assert.equal(new Set(assessments.flatMap(item => item.questions.map(question => question.id)).concat(dailyQuizzes.flat().map(question => question.id))).size, 340);
  assert.ok(curriculum.every(day => day.quiz.length === new Set(day.quiz.map(question => question.prompt)).size));

  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'algorithm-hub-learning-'));
  const port = await reservePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const child = spawn(process.execPath, ['server.js'], {
    cwd: backendDir,
    env: {
      ...process.env,
      PORT: String(port),
      JWT_SECRET: 'test-only-secret-for-learning-api',
      DB_PATH: path.join(tempDir, 'learning-test.db'),
      FRONTEND_ORIGINS: baseUrl,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', data => { output += data.toString(); });
  child.stderr.on('data', data => { output += data.toString(); });

  const request = async (route, { token, method = 'GET', body } = {}) => {
    const response = await fetch(`${baseUrl}${route}`, {
      method,
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: response.status, body: await response.json() };
  };

  try {
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (child.exitCode !== null) throw new Error(`Backend exited early: ${output}`);
      try {
        if ((await fetch(`${baseUrl}/api/health`)).ok) {
          ready = true;
          break;
        }
      } catch {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    assert.equal(ready, true, `Backend did not start: ${output}`);

    const unauthenticated = await request('/api/dashboard');
    assert.equal(unauthenticated.status, 401);

    const first = await request('/api/register', {
      method: 'POST',
      body: { name: 'First Student', email: 'first@example.test', password: 'safe-password-1' },
    });
    const second = await request('/api/register', {
      method: 'POST',
      body: { name: 'Second Student', email: 'second@example.test', password: 'safe-password-2' },
    });
    assert.equal(first.status, 201);
    assert.equal(second.status, 201);
    assert.equal((await request('/api/register', {
      method: 'POST',
      body: { name: 'Duplicate Student', email: 'FIRST@example.test', password: 'safe-password-3' },
    })).status, 409);
    assert.equal((await request('/api/login', {
      method: 'POST',
      body: { email: 'first@example.test', password: 'incorrect-password' },
    })).status, 401);
    const firstToken = first.body.token;
    const secondToken = second.body.token;

    const dashboard = await request('/api/dashboard', { token: firstToken });
    assert.equal(dashboard.status, 200);
    assert.equal(dashboard.body.user.email, 'first@example.test');
    assert.equal(dashboard.body.currentDay, 1);
    assert.equal(dashboard.body.progressPercent, 0);
    assert.equal((await request('/api/dashboard', { token: 'invalid-token' })).status, 401);
    const lesson = await request('/api/learning/1', { token: firstToken });
    assert.equal(lesson.body.lesson.quiz.length, 10);
    assert.equal(Object.hasOwn(lesson.body.lesson.quiz[0], 'answer'), false);
    assert.equal(Object.hasOwn(lesson.body.lesson.activityValidation, 'expectedAnswer'), false);
    assert.equal((await request('/api/assessments/foundation', { token: firstToken })).status, 403);
    assert.equal((await request('/api/learning/2', { token: firstToken })).status, 403);

    const started = await request('/api/learning/1/start', { token: firstToken, method: 'POST' });
    assert.equal(started.status, 200);
    assert.equal((await request('/api/learning/1/activity', {
      token: firstToken,
      method: 'POST',
      body: { answer: '4' },
    })).status, 400);
    assert.equal((await request('/api/learning/1/concept', {
      token: firstToken,
      method: 'POST',
      body: { reviewed: true },
    })).status, 200);
    assert.equal((await request('/api/learning/1/quiz', {
      token: firstToken,
      method: 'POST',
      body: { answers: { 'day-1-q-1': 0 } },
    })).status, 400);
    assert.equal((await request('/api/learning/1/activity', {
      token: firstToken,
      method: 'POST',
      body: { answer: '3' },
    })).status, 422);
    assert.equal((await request('/api/learning/1/activity', {
      token: firstToken,
      method: 'POST',
      body: { answer: '4' },
    })).status, 200);

    const wrongAnswers = Object.fromEntries(curriculum[0].quiz.map((question, index) => [
      question.id,
      index < 4 ? (question.answer + 1) % question.options.length : question.answer,
    ]));
    const failedQuiz = await request('/api/learning/1/quiz', {
      token: firstToken,
      method: 'POST',
      body: { answers: wrongAnswers },
    });
    assert.equal(failedQuiz.status, 200);
    assert.equal(failedQuiz.body.passed, false);
    assert.equal(failedQuiz.body.score, 60);
    assert.equal((await request('/api/learning/2', { token: firstToken })).status, 403);

    const correctAnswers = Object.fromEntries(curriculum[0].quiz.map(question => [question.id, question.answer]));
    const passedQuiz = await request('/api/learning/1/quiz', {
      token: firstToken,
      method: 'POST',
      body: { answers: correctAnswers },
    });
    assert.equal(passedQuiz.body.passed, true);
    assert.equal(passedQuiz.body.score, 100);
    assert.equal((await request('/api/learning/2', { token: firstToken })).status, 200);

    for (let day = 2; day <= 7; day += 1) {
      const lessonContent = (await request(`/api/learning/${day}`, { token: firstToken })).body.lesson;
      assert.equal((await request(`/api/learning/${day}/start`, { token: firstToken, method: 'POST' })).status, 200);
      assert.equal((await request(`/api/learning/${day}/concept`, {
        token: firstToken,
        method: 'POST',
        body: { reviewed: true },
      })).status, 200);
      assert.equal((await request(`/api/learning/${day}/activity`, {
        token: firstToken,
        method: 'POST',
        body: { answer: curriculum[day - 1].activityValidation.expectedAnswer },
      })).status, 200);
      const answers = Object.fromEntries(lessonContent.quiz.map(question => [question.id, curriculum[day - 1].quiz.find(item => item.id === question.id).answer]));
      const result = await request(`/api/learning/${day}/quiz`, { token: firstToken, method: 'POST', body: { answers } });
      assert.equal(result.body.passed, true);
    }
    assert.equal((await request('/api/learning/8', { token: firstToken })).status, 403);
    const foundationAssessment = await request('/api/assessments/foundation', { token: firstToken });
    assert.equal(foundationAssessment.status, 200);
    assert.equal(foundationAssessment.body.questions.length, 10);
    const failingAssessmentAnswers = Object.fromEntries(assessments[0].questions.map((question, index) => [
      question.id,
      index < 4 ? (question.answer + 1) % question.options.length : question.answer,
    ]));
    const failedAssessment = await request('/api/assessments/foundation/quiz', {
      token: firstToken,
      method: 'POST',
      body: { answers: failingAssessmentAnswers },
    });
    assert.equal(failedAssessment.body.score, 60);
    assert.equal(failedAssessment.body.passed, false);
    assert.equal((await request('/api/learning/8', { token: firstToken })).status, 403);
    const passedAssessment = await request('/api/assessments/foundation/quiz', {
      token: firstToken,
      method: 'POST',
      body: { answers: Object.fromEntries(assessments[0].questions.map(question => [question.id, question.answer])) },
    });
    assert.equal(passedAssessment.body.passed, true);
    assert.equal((await request('/api/learning/8', { token: firstToken })).status, 200);

    for (let day = 8; day <= 30; day += 1) {
      const lessonContent = await request(`/api/learning/${day}`, { token: firstToken });
      assert.equal(lessonContent.status, 200, `Day ${day} should unlock after the previous day is complete.`);
      assert.equal((await request(`/api/learning/${day}/start`, {
        token: firstToken,
        method: 'POST',
      })).status, 200);
      assert.equal((await request(`/api/learning/${day}/concept`, {
        token: firstToken,
        method: 'POST',
        body: { reviewed: true },
      })).status, 200);
      assert.equal((await request(`/api/learning/${day}/activity`, {
        token: firstToken,
        method: 'POST',
        body: { answer: curriculum[day - 1].activityValidation.expectedAnswer },
      })).status, 200);

      const answers = Object.fromEntries(curriculum[day - 1].quiz.map(question => [question.id, question.answer]));
      const dailyQuiz = await request(`/api/learning/${day}/quiz`, {
        token: firstToken,
        method: 'POST',
        body: { answers },
      });
      assert.equal(dailyQuiz.body.passed, true, `Day ${day} daily quiz should pass.`);

      const assessment = assessments.find(item => item.days[item.days.length - 1] === day);
      if (!assessment) continue;

      assert.equal(dailyQuiz.body.completed, false, `Day ${day} must require its milestone assessment.`);
      if (day < 30) {
        assert.equal((await request(`/api/learning/${day + 1}`, { token: firstToken })).status, 403);
      }
      const assessmentContent = await request(`/api/assessments/${assessment.id}`, { token: firstToken });
      assert.equal(assessmentContent.status, 200, `${assessment.title} should unlock after its daily quiz.`);
      assert.equal(assessmentContent.body.questions.length, 10);

      const assessmentUrl = `/api/assessments/${assessment.id}/quiz`;
      const wrongAnswers = Object.fromEntries(assessment.questions.map((question, index) => [
        question.id,
        index < 4 ? (question.answer + 1) % question.options.length : question.answer,
      ]));
      const failedAssessment = await request(assessmentUrl, {
        token: firstToken,
        method: 'POST',
        body: { answers: wrongAnswers },
      });
      assert.equal(failedAssessment.body.score, 60, `${assessment.title} should be graded by the server.`);
      assert.equal(failedAssessment.body.passed, false);
      if (day < 30) {
        assert.equal((await request(`/api/learning/${day + 1}`, { token: firstToken })).status, 403);
      }

      const passedAssessment = await request(assessmentUrl, {
        token: firstToken,
        method: 'POST',
        body: { answers: Object.fromEntries(assessment.questions.map(question => [question.id, question.answer])) },
      });
      assert.equal(passedAssessment.body.score, 100);
      assert.equal(passedAssessment.body.passed, true);
      if (day < 30) {
        assert.equal((await request(`/api/learning/${day + 1}`, { token: firstToken })).status, 200);
      }
    }

    const secondDashboard = await request('/api/dashboard', { token: secondToken });
    assert.equal(secondDashboard.body.user.email, 'second@example.test');
    assert.equal(secondDashboard.body.completedDays, 0);
    assert.equal(secondDashboard.body.progress[0].status, 'Available');
    assert.equal(secondDashboard.body.quizAttempts.length, 0);
    assert.equal(secondDashboard.body.assessmentAttempts.length, 0);
    const ownNotification = dashboard.body.notifications[0];
    assert.equal((await request(`/api/notifications/${ownNotification.id}/read`, {
      token: secondToken,
      method: 'PATCH',
    })).status, 404);

    assert.equal((await request('/api/logout', { token: firstToken, method: 'POST' })).status, 200);
    assert.equal((await request('/api/dashboard', { token: firstToken })).status, 401);
    const relogin = await request('/api/login', { method: 'POST', body: { email: 'first@example.test', password: 'safe-password-1' } });
    assert.equal(relogin.status, 200);
    const persistedDashboard = await request('/api/dashboard', { token: relogin.body.token });
    assert.equal(persistedDashboard.body.completedDays, 30);
    assert.equal(persistedDashboard.body.progressPercent, 100);
    assert.equal(persistedDashboard.body.quizAttempts.length, 31);
    assert.equal(persistedDashboard.body.assessmentAttempts.length, 8);
    assert.ok(persistedDashboard.body.progress.every(day => day.status === 'Completed'));
    assert.equal(persistedDashboard.body.assessmentAttempts.filter(attempt => attempt.passed).length, 4);
    assert.equal(persistedDashboard.body.assessmentAttempts.some(attempt => attempt.title === 'Foundation Assessment' && attempt.passed), true);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill();
      await new Promise(resolve => child.once('exit', resolve));
    }
    await rm(tempDir, { recursive: true, force: true });
  }
});
