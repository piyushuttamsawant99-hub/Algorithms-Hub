import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'node:url';
import { curriculum } from '../curriculum.js';
import { assessments } from '../quiz-bank.js';

const backendDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const reservePort = () => new Promise((resolve, reject) => {
  const server = createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    server.close(error => error ? reject(error) : resolve(port));
  });
});

const query = (databasePath, sql) => new Promise((resolve, reject) => {
  const database = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, error => {
    if (error) {
      reject(error);
      return;
    }
    database.get(sql, (queryError, row) => {
      database.close(closeError => {
        if (queryError) reject(queryError);
        else if (closeError) reject(closeError);
        else resolve(row);
      });
    });
  });
});

const queryAll = (databasePath, sql) => new Promise((resolve, reject) => {
  const database = new sqlite3.Database(databasePath, sqlite3.OPEN_READONLY, error => {
    if (error) {
      reject(error);
      return;
    }
    database.all(sql, (queryError, rows) => {
      database.close(closeError => {
        if (queryError) reject(queryError);
        else if (closeError) reject(closeError);
        else resolve(rows);
      });
    });
  });
});

test('SQLite content migration is complete, API-backed, repeatable, and preserves user progress', async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'algorithm-hub-content-'));
  const databasePath = path.join(tempDir, 'content-test.db');
  const port = await reservePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const environment = {
    ...process.env,
    PORT: String(port),
    JWT_SECRET: 'test-only-content-migration-secret',
    DB_PATH: databasePath,
    FRONTEND_ORIGINS: baseUrl,
  };
  let child;
  let output = '';

  const startBackend = async () => {
    child = spawn(process.execPath, ['server.js'], {
      cwd: backendDir,
      env: environment,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    child.stdout.on('data', data => { output += data.toString(); });
    child.stderr.on('data', data => { output += data.toString(); });
    for (let attempt = 0; attempt < 80; attempt += 1) {
      if (child.exitCode !== null) throw new Error(`Backend exited early: ${output}`);
      try {
        if ((await fetch(`${baseUrl}/api/health`)).ok) return;
      } catch {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    throw new Error(`Backend did not start: ${output}`);
  };

  const stopBackend = async () => {
    if (child && child.exitCode === null && child.signalCode === null) {
      child.kill();
      await new Promise(resolve => child.once('exit', resolve));
    }
  };

  try {
    await startBackend();
    const catalogResponse = await fetch(`${baseUrl}/api/algorithms`);
    assert.equal(catalogResponse.status, 200);
    const { groups } = await catalogResponse.json();
    const algorithms = Object.values(groups).flatMap(group => group.items);
    assert.equal(algorithms.length, 93);
    assert.ok(algorithms.every(item => item.length === 4 && item[2] && item[3]));
    const scriptResponse = await fetch(`${baseUrl}/api/algorithm-groups.js`);
    assert.equal(scriptResponse.status, 200);
    assert.match(await scriptResponse.text(), /window\.algorithmGroups\s*=/);

    const counts = await query(databasePath, `
      SELECT
        (SELECT COUNT(*) FROM algorithms) AS algorithms,
        (SELECT COUNT(*) FROM lessons) AS lessons,
        (SELECT COUNT(*) FROM quizzes) AS quizzes,
        (SELECT COUNT(*) FROM quiz_questions) AS questions
    `);
    assert.deepEqual(counts, { algorithms: 93, lessons: 30, quizzes: 34, questions: 340 });

    const storedLessons = await queryAll(databasePath, 'SELECT * FROM lessons ORDER BY day');
    for (const [index, row] of storedLessons.entries()) {
      const source = curriculum[index];
      assert.equal(row.day, source.day);
      assert.equal(row.title, source.title);
      assert.equal(row.level, source.level);
      assert.equal(row.minutes, source.minutes);
      assert.deepEqual(JSON.parse(row.objectivesJson), source.objectives);
      assert.equal(row.explanation, source.explanation);
      assert.deepEqual(JSON.parse(row.exampleJson), source.example);
      assert.equal(row.steps, source.steps);
      assert.equal(row.activity, source.activity);
      assert.equal(row.activityInput, source.activityValidation.input);
      assert.equal(row.activityHint, source.activityValidation.hint);
      assert.equal(row.activityExpectedAnswer, source.activityValidation.expectedAnswer);
      assert.deepEqual(JSON.parse(row.linksJson), source.links);
    }
    const storedQuestions = await queryAll(databasePath, `
      SELECT quizId, id, prompt, optionsJson, answerIndex, hint, explanation
      FROM quiz_questions ORDER BY quizId, position
    `);
    const expectedQuizQuestions = [
      ...curriculum.map(lesson => [`daily-${lesson.day}`, lesson.quiz]),
      ...assessments.map(assessment => [assessment.id, assessment.questions]),
    ];
    for (const [quizId, questions] of expectedQuizQuestions) {
      const rows = storedQuestions.filter(question => question.quizId === quizId);
      assert.equal(rows.length, questions.length, `${quizId} question count`);
      for (const [index, question] of questions.entries()) {
        assert.deepEqual(rows[index], {
          quizId,
          id: question.id,
          prompt: question.prompt,
          optionsJson: JSON.stringify(question.options),
          answerIndex: question.answer,
          hint: question.hint,
          explanation: question.explanation,
        });
      }
    }

    const registration = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Migration Test', email: 'migration@example.test', password: 'safe-password' }),
    });
    assert.equal(registration.status, 201);
    const { token } = await registration.json();
    const lessonStarted = await fetch(`${baseUrl}/api/learning/1/start`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(lessonStarted.status, 200);

    await stopBackend();
    await startBackend();
    const repeatedCounts = await query(databasePath, `
      SELECT
        (SELECT COUNT(*) FROM algorithms) AS algorithms,
        (SELECT COUNT(*) FROM lessons) AS lessons,
        (SELECT COUNT(*) FROM quizzes) AS quizzes,
        (SELECT COUNT(*) FROM quiz_questions) AS questions
    `);
    assert.deepEqual(repeatedCounts, counts, 'restarting must not duplicate content records');
    const dashboard = await fetch(`${baseUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(dashboard.status, 200);
    const dashboardBody = await dashboard.json();
    assert.equal(dashboardBody.progress[0].status, 'In Progress');
    assert.equal(dashboardBody.progress[0].title, 'Algorithm thinking');
  } finally {
    await stopBackend();
    await rm(tempDir, { recursive: true, force: true });
  }
});
