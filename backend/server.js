import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash, randomUUID } from 'node:crypto';
import { curriculum, publicDay } from './curriculum.js';
import { assessments, assessmentDefinitions } from './quiz-bank.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-development-secret-change-before-deployment');
if (!JWT_SECRET) {
  console.error('Missing JWT_SECRET. Set a strong JWT_SECRET environment variable before production startup.');
  process.exit(1);
}
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'algorithm-hub.db');
mkdirSync(path.dirname(DB_PATH), { recursive: true });

const app = express();
const db = new sqlite3.Database(DB_PATH);

const allowedOrigins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:4173,http://127.0.0.1:4173')
  .split(',').map(value => value.trim()).filter(Boolean);
const isPrivateLanOrigin = origin => /^https?:\/\/(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(:\d+)?$/.test(origin);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && isPrivateLanOrigin(origin))) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by the Algorithm Hub API CORS policy.'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '100kb' }));

const runDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) {
      reject(err);
      return;
    }
    resolve({ id: this.lastID, changes: this.changes });
  });
});

const getDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(row);
  });
});

const allDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(rows);
  });
});

const initializeDb = async () => {
  await runDb(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS learning_progress (
      userId TEXT NOT NULL,
      day INTEGER NOT NULL CHECK(day BETWEEN 1 AND 30),
      startedAt TEXT,
      activityCompletedAt TEXT,
      completedAt TEXT,
      latestScore REAL NOT NULL DEFAULT 0,
      conceptCompletedAt TEXT,
      dailyQuizPassed INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (userId, day),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      day INTEGER NOT NULL CHECK(day BETWEEN 1 AND 30),
      score REAL NOT NULL,
      passed INTEGER NOT NULL,
      submittedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      notificationKey TEXT NOT NULL UNIQUE,
      userId TEXT NOT NULL,
      day INTEGER NOT NULL CHECK(day BETWEEN 1 AND 30),
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      readAt TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS revoked_tokens (
      tokenHash TEXT PRIMARY KEY,
      expiresAt TEXT NOT NULL
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS activity_attempts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      day INTEGER NOT NULL CHECK(day BETWEEN 1 AND 30),
      answer TEXT NOT NULL,
      accepted INTEGER NOT NULL,
      submittedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS assessment_attempts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      assessmentId TEXT NOT NULL,
      score REAL NOT NULL,
      passed INTEGER NOT NULL,
      submittedAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
  const progressColumns = await allDb('PRAGMA table_info(learning_progress)');
  if (!progressColumns.some(column => column.name === 'conceptCompletedAt')) {
    await runDb('ALTER TABLE learning_progress ADD COLUMN conceptCompletedAt TEXT');
  }
  if (!progressColumns.some(column => column.name === 'dailyQuizPassed')) {
    await runDb('ALTER TABLE learning_progress ADD COLUMN dailyQuizPassed INTEGER NOT NULL DEFAULT 0');
  }
};

const createToken = (user) => jwt.sign(
  { id: user.id, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

const requireAuth = async (req, res, next) => {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Sign in to access your learning dashboard.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const revoked = await getDb('SELECT tokenHash FROM revoked_tokens WHERE tokenHash = ?', [createHash('sha256').update(token).digest('hex')]);
    if (revoked) return res.status(401).json({ message: 'This session has been signed out. Please sign in again.' });
    const user = await getDb('SELECT id, name, email FROM users WHERE id = ?', [payload.id]);
    if (!user) return res.status(401).json({ message: 'Your session is no longer valid. Please sign in again.' });
    req.user = user;
    req.token = token;
    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session is invalid or expired. Please sign in again.' });
    }
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Unable to verify your session right now.' });
  }
};

const getProgress = (userId) => allDb(
  'SELECT day, startedAt, activityCompletedAt, conceptCompletedAt, dailyQuizPassed, completedAt, latestScore FROM learning_progress WHERE userId = ? ORDER BY day',
  [userId]
);

const getAssessment = (id) => assessments.find(assessment => assessment.id === id);
const milestoneForDay = day => ({ 7: 'foundation', 14: 'sorting', 21: 'graphs', 30: 'final' })[day] || null;
const hasPassedAssessment = (userId, assessmentId) => getDb(
  'SELECT id FROM assessment_attempts WHERE userId = ? AND assessmentId = ? AND passed = 1 LIMIT 1',
  [userId, assessmentId]
);
const normalizeActivityAnswer = value => String(value).trim().toLowerCase().replace(/\s+/g, ' ');

const makeDashboardNotifications = async (userId, progress) => {
  const completed = new Set(progress.filter(item => item.completedAt).map(item => item.day));
  const nextDay = Math.min(30, [...Array(30).keys()].find(day => !completed.has(day + 1)) + 1);
  const now = new Date().toISOString();
  const messages = [];
  if (completed.size < 30) {
    messages.push({ key: `${userId}:ready:${nextDay}`, day: nextDay, message: `Day ${nextDay} is ready to start.` });
    const started = progress.find(item => item.day === nextDay && item.startedAt && !item.completedAt);
    if (started) {
      messages.push({ key: `${userId}:incomplete:${nextDay}`, day: nextDay, message: `Day ${nextDay} is in progress. Complete the activity and pass its quiz to unlock the next day.` });
    }
  } else {
    messages.push({ key: `${userId}:complete:30`, day: 30, message: 'Congratulations! Your 30-day learning program is complete.' });
  }
  for (const item of progress.filter(item => item.completedAt)) {
    messages.push({ key: `${userId}:completed:${item.day}`, day: item.day, message: `Congratulations! You completed Day ${item.day}.` });
  }
  for (const notification of messages) {
    await runDb(
      'INSERT OR IGNORE INTO notifications (id, notificationKey, userId, day, message, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
      [randomUUID(), notification.key, userId, notification.day, notification.message, now]
    );
  }
  const activeDay = completed.size < 30 ? nextDay : 0;
  await runDb(
    "UPDATE notifications SET readAt = COALESCE(readAt, ?) WHERE userId = ? AND (notificationKey LIKE ? OR notificationKey LIKE ?) AND day <> ?",
    [now, userId, `${userId}:ready:%`, `${userId}:incomplete:%`, activeDay]
  );
};

const dayStatus = (day, progress, currentDay) => {
  const record = progress.find(item => item.day === day);
  if (record?.completedAt) return 'Completed';
  if (day > currentDay) return 'Locked';
  return record?.startedAt ? 'In Progress' : 'Available';
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Algorithm Hub backend is running.' });
});

app.post('/api/logout', requireAuth, async (req, res) => {
  try {
    const payload = jwt.decode(req.token);
    const expiresAt = new Date(payload.exp * 1000).toISOString();
    await runDb('DELETE FROM revoked_tokens WHERE expiresAt <= ?', [new Date().toISOString()]);
    await runDb('INSERT OR IGNORE INTO revoked_tokens (tokenHash, expiresAt) VALUES (?, ?)', [
      createHash('sha256').update(req.token).digest('hex'),
      expiresAt,
    ]);
    res.json({ message: 'Signed out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Unable to sign out on the server right now.' });
  }
});

app.get('/api/dashboard', requireAuth, async (req, res) => {
  try {
    const progress = await getProgress(req.user.id);
    await makeDashboardNotifications(req.user.id, progress);
    const attempts = await allDb(
      'SELECT day, score, passed, submittedAt FROM quiz_attempts WHERE userId = ? ORDER BY submittedAt DESC LIMIT 50',
      [req.user.id]
    );
    const assessmentAttempts = await allDb(
      'SELECT assessmentId, score, passed, submittedAt FROM assessment_attempts WHERE userId = ? ORDER BY submittedAt DESC LIMIT 20',
      [req.user.id]
    );
    const scoreSummary = await getDb(
      'SELECT AVG(score) AS average, COUNT(*) AS count FROM quiz_attempts WHERE userId = ?',
      [req.user.id]
    );
    const topicPerformance = await allDb(
      'SELECT day, AVG(score) AS average, COUNT(*) AS attempts FROM quiz_attempts WHERE userId = ? GROUP BY day ORDER BY average DESC, day',
      [req.user.id]
    );
    const weeklyPerformance = await allDb(
      'SELECT CAST((day - 1) / 7 AS INTEGER) + 1 AS week, ROUND(AVG(score)) AS average, COUNT(*) AS attempts FROM quiz_attempts WHERE userId = ? GROUP BY week ORDER BY week',
      [req.user.id]
    );
    const notifications = await allDb(
      'SELECT id, day, message, createdAt, readAt FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 30',
      [req.user.id]
    );
    const completedDays = progress.filter(item => item.completedAt).length;
    const nextDay = completedDays < 30
      ? Math.min(30, [...Array(30).keys()].find(day => !progress.some(item => item.day === day + 1 && item.completedAt)) + 1)
      : 30;
    const activityDates = [...new Set(progress.flatMap(item => [item.startedAt, item.completedAt].filter(Boolean).map(value => value.slice(0, 10))))].sort().reverse();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    let streak = 0;
    let expected = activityDates[0] === today ? today : yesterday;
    if (activityDates.includes(expected)) {
      for (const date of activityDates) {
        if (date !== expected) break;
        streak += 1;
        expected = new Date(`${expected}T00:00:00.000Z`);
        expected.setUTCDate(expected.getUTCDate() - 1);
        expected = expected.toISOString().slice(0, 10);
      }
    }
    const quizAverage = scoreSummary.count ? Math.round(scoreSummary.average) : null;
    res.json({
      user: req.user,
      passingScore: 70,
      completedDays,
      pendingDays: 30 - completedDays,
      currentDay: nextDay,
      progressPercent: Math.round(completedDays / 30 * 100),
      streak,
      quizAverage,
      latestAttempt: attempts[0] || null,
      quizAttempts: attempts,
      assessmentAttempts: assessmentAttempts.map(attempt => ({
        ...attempt,
        title: getAssessment(attempt.assessmentId)?.title || attempt.assessmentId,
      })),
      topicPerformance: topicPerformance.map(item => ({
        day: item.day,
        title: curriculum[item.day - 1].title,
        average: Math.round(item.average),
        attempts: item.attempts,
      })),
      weeklyPerformance,
      progress: Array.from({ length: 30 }, (_, index) => {
        const day = index + 1;
        const record = progress.find(item => item.day === day);
        return {
          day,
          title: curriculum[index].title,
          level: curriculum[index].level,
          minutes: curriculum[index].minutes,
          status: dayStatus(day, progress, nextDay),
          startedAt: record?.startedAt || null,
          completedAt: record?.completedAt || null,
          latestScore: record?.latestScore || 0,
        };
      }),
      recentActivity: progress
        .filter(item => item.startedAt || item.completedAt)
        .slice(-6)
        .reverse()
        .map(item => ({ day: item.day, title: curriculum[item.day - 1].title, startedAt: item.startedAt, completedAt: item.completedAt })),
      notifications,
    });
  } catch (error) {
    console.error('Dashboard load error:', error);
    res.status(500).json({ message: 'Unable to load your learning dashboard right now.' });
  }
});

app.get('/api/learning/:day', requireAuth, async (req, res) => {
  const day = Number(req.params.day);
  if (!Number.isInteger(day) || day < 1 || day > 30) return res.status(400).json({ message: 'Choose a learning day from 1 to 30.' });
  try {
    const progress = await getProgress(req.user.id);
    const nextDay = progress.filter(item => item.completedAt).length + 1;
    const existing = progress.find(item => item.day === day);
    if (day > nextDay && !existing?.completedAt) return res.status(403).json({ message: 'Complete the previous day to unlock this lesson.' });
    const assessmentId = milestoneForDay(day);
    const assessmentPassed = assessmentId ? Boolean(await hasPassedAssessment(req.user.id, assessmentId)) : true;
    res.json({
      lesson: publicDay(day),
      nextDayTitle: day < 30 ? curriculum[day].title : null,
      status: dayStatus(day, progress, Math.min(30, nextDay)),
      progress: existing || null,
      assessmentId,
      assessmentPassed,
      passingScore: 70,
    });
  } catch (error) {
    console.error('Learning content load error:', error);
    res.status(500).json({ message: 'Unable to load this lesson right now.' });
  }
});

app.post('/api/learning/:day/concept', requireAuth, async (req, res) => {
  const day = Number(req.params.day);
  if (!Number.isInteger(day) || day < 1 || day > 30 || req.body?.reviewed !== true) {
    return res.status(400).json({ message: 'Review the lesson concept before confirming this stage.' });
  }
  try {
    const progress = await getProgress(req.user.id);
    const nextDay = progress.filter(item => item.completedAt).length + 1;
    const existing = progress.find(item => item.day === day);
    if (day > nextDay || !existing?.startedAt) return res.status(403).json({ message: 'Start this unlocked lesson before confirming the concept stage.' });
    await runDb(
      'UPDATE learning_progress SET conceptCompletedAt = COALESCE(conceptCompletedAt, ?) WHERE userId = ? AND day = ?',
      [new Date().toISOString(), req.user.id, day]
    );
    res.json({ message: 'Concept review saved.' });
  } catch (error) {
    console.error('Concept review error:', error);
    res.status(500).json({ message: 'Unable to save your concept review right now.' });
  }
});

app.post('/api/learning/:day/start', requireAuth, async (req, res) => {
  const day = Number(req.params.day);
  if (!Number.isInteger(day) || day < 1 || day > 30) return res.status(400).json({ message: 'Choose a learning day from 1 to 30.' });
  try {
    const progress = await getProgress(req.user.id);
    const nextDay = progress.filter(item => item.completedAt).length + 1;
    const existing = progress.find(item => item.day === day);
    if (day > nextDay && !existing?.completedAt) return res.status(403).json({ message: 'Complete the previous day to unlock this lesson.' });
    if (!existing?.completedAt) {
      await runDb(
        'INSERT INTO learning_progress (userId, day, startedAt) VALUES (?, ?, ?) ON CONFLICT(userId, day) DO UPDATE SET startedAt = COALESCE(learning_progress.startedAt, excluded.startedAt)',
        [req.user.id, day, new Date().toISOString()]
      );
    }
    res.json({ message: 'Lesson started.', status: existing?.completedAt ? 'Completed' : 'In Progress' });
  } catch (error) {
    console.error('Learning start error:', error);
    res.status(500).json({ message: 'Unable to save lesson progress right now.' });
  }
});

app.post('/api/learning/:day/activity', requireAuth, async (req, res) => {
  const day = Number(req.params.day);
  const answer = req.body?.answer;
  if (!Number.isInteger(day) || day < 1 || day > 30 || typeof answer !== 'string' || answer.trim().length < 1 || answer.length > 500) {
    return res.status(400).json({ message: 'Submit your activity result (1–500 characters).' });
  }
  try {
    const progress = await getProgress(req.user.id);
    const nextDay = progress.filter(item => item.completedAt).length + 1;
    const existing = progress.find(item => item.day === day);
    if (day > nextDay || !existing?.startedAt) return res.status(403).json({ message: 'Start this unlocked lesson before recording its activity.' });
    if (!existing.conceptCompletedAt) return res.status(400).json({ message: 'Review and confirm the concept before submitting your activity.' });
    if (existing.completedAt) return res.json({ message: 'This day is already complete.', status: 'Completed' });
    if (existing.activityCompletedAt) return res.json({ message: 'Activity test already passed.', status: 'In Progress' });
    const expectedAnswer = curriculum[day - 1].activityValidation.expectedAnswer;
    const accepted = normalizeActivityAnswer(answer) === normalizeActivityAnswer(expectedAnswer);
    await runDb(
      'INSERT INTO activity_attempts (id, userId, day, answer, accepted, submittedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [randomUUID(), req.user.id, day, answer.trim(), accepted ? 1 : 0, new Date().toISOString()]
    );
    if (!accepted) return res.status(422).json({ message: 'That result does not match the activity test case yet. Recheck the input and hint, then try again.' });
    await runDb(
      'UPDATE learning_progress SET activityCompletedAt = COALESCE(activityCompletedAt, ?) WHERE userId = ? AND day = ?',
      [new Date().toISOString(), req.user.id, day]
    );
    res.json({ message: 'Activity test passed. You can now take the daily quiz.' });
  } catch (error) {
    console.error('Learning activity error:', error);
    res.status(500).json({ message: 'Unable to save the activity right now.' });
  }
});

app.post('/api/learning/:day/quiz', requireAuth, async (req, res) => {
  const day = Number(req.params.day);
  const answers = req.body?.answers;
  if (!Number.isInteger(day) || day < 1 || day > 30 || !answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return res.status(400).json({ message: 'Submit answers for this day’s quiz.' });
  }
  const quiz = curriculum[day - 1].quiz;
  const keys = Object.keys(answers).sort();
  const expectedKeys = quiz.map(question => question.id).sort();
  if (keys.length !== expectedKeys.length || keys.some((key, index) => key !== expectedKeys[index]) ||
      quiz.some(question => !Number.isInteger(answers[question.id]) || answers[question.id] < 0 || answers[question.id] >= question.options.length)) {
    return res.status(400).json({ message: 'Answer every quiz question using a valid option.' });
  }
  try {
    const progress = await getProgress(req.user.id);
    const nextDay = progress.filter(item => item.completedAt).length + 1;
    const existing = progress.find(item => item.day === day);
    if (day > nextDay || !existing?.startedAt) return res.status(403).json({ message: 'Start this unlocked lesson before submitting its quiz.' });
    if (!existing.conceptCompletedAt) return res.status(400).json({ message: 'Review and confirm the concept before submitting the quiz.' });
    if (!existing.activityCompletedAt) return res.status(400).json({ message: 'Complete the practical activity before submitting the quiz.' });
    let correct = 0;
    const feedback = quiz.map(question => {
      const isCorrect = answers[question.id] === question.answer;
      if (isCorrect) correct += 1;
      return {
        id: question.id,
        correct: isCorrect,
        expectedAnswer: question.options[question.answer],
        explanation: question.explanation,
      };
    });
    const score = Math.round(correct / quiz.length * 100);
    const passed = score >= 70;
    const submittedAt = new Date().toISOString();
    const assessmentId = milestoneForDay(day);
    const assessmentPassed = assessmentId ? Boolean(await hasPassedAssessment(req.user.id, assessmentId)) : true;
    const completed = passed && assessmentPassed;
    await runDb('INSERT INTO quiz_attempts (id, userId, day, score, passed, submittedAt) VALUES (?, ?, ?, ?, ?, ?)', [
      randomUUID(), req.user.id, day, score, passed ? 1 : 0, submittedAt,
    ]);
    await runDb(
      'UPDATE learning_progress SET latestScore = ?, dailyQuizPassed = CASE WHEN ? = 1 THEN 1 ELSE dailyQuizPassed END, completedAt = CASE WHEN ? = 1 THEN COALESCE(completedAt, ?) ELSE completedAt END WHERE userId = ? AND day = ?',
      [score, passed ? 1 : 0, completed ? 1 : 0, submittedAt, req.user.id, day]
    );
    const updated = await getProgress(req.user.id);
    await makeDashboardNotifications(req.user.id, updated);
    const message = !passed
      ? 'Not passed yet. Review the explanations and try again.'
      : !assessmentPassed
        ? `${assessmentDefinitions.find(item => item.id === assessmentId).title} is also required to complete this day.`
        : `Day ${day} completed. The next lesson is unlocked.`;
    res.json({
      score,
      passed,
      completed,
      passingScore: 70,
      completedAt: completed ? submittedAt : null,
      feedback,
      message,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ message: 'Unable to submit this quiz right now.' });
  }
});

app.get('/api/assessments/:assessmentId', requireAuth, async (req, res) => {
  const assessment = getAssessment(req.params.assessmentId);
  if (!assessment) return res.status(404).json({ message: 'Assessment not found.' });
  const milestoneDay = assessment.days[assessment.days.length - 1];
  try {
    const progress = await getProgress(req.user.id);
    const dayProgress = progress.find(item => item.day === milestoneDay);
    if (!dayProgress?.startedAt || !dayProgress.activityCompletedAt || !dayProgress.conceptCompletedAt || !dayProgress.dailyQuizPassed) {
      return res.status(403).json({ message: `Complete Day ${milestoneDay}'s concept, practical activity, and daily quiz first.` });
    }
    const previousAttempt = await hasPassedAssessment(req.user.id, assessment.id);
    res.json({
      id: assessment.id,
      title: assessment.title,
      day: milestoneDay,
      passed: Boolean(previousAttempt),
      passingScore: 70,
      questions: assessment.questions.map(({ id, prompt, options, hint }) => ({ id, prompt, options, hint })),
    });
  } catch (error) {
    console.error('Assessment load error:', error);
    res.status(500).json({ message: 'Unable to load this assessment right now.' });
  }
});

app.post('/api/assessments/:assessmentId/quiz', requireAuth, async (req, res) => {
  const assessment = getAssessment(req.params.assessmentId);
  const answers = req.body?.answers;
  if (!assessment || !answers || typeof answers !== 'object' || Array.isArray(answers)) {
    return res.status(400).json({ message: 'Submit answers for a valid assessment.' });
  }
  const keys = Object.keys(answers).sort();
  const expectedKeys = assessment.questions.map(question => question.id).sort();
  if (keys.length !== expectedKeys.length || keys.some((key, index) => key !== expectedKeys[index]) ||
      assessment.questions.some(question => !Number.isInteger(answers[question.id]) || answers[question.id] < 0 || answers[question.id] >= question.options.length)) {
    return res.status(400).json({ message: 'Answer every assessment question using a valid option.' });
  }
  try {
    const milestoneDay = assessment.days[assessment.days.length - 1];
    const progress = await getProgress(req.user.id);
    const dayProgress = progress.find(item => item.day === milestoneDay);
    if (!dayProgress?.startedAt || !dayProgress.activityCompletedAt || !dayProgress.conceptCompletedAt || !dayProgress.dailyQuizPassed) {
      return res.status(403).json({ message: `Complete Day ${milestoneDay}'s concept, practical activity, and daily quiz first.` });
    }
    let correct = 0;
    const feedback = assessment.questions.map(question => {
      const isCorrect = answers[question.id] === question.answer;
      if (isCorrect) correct += 1;
      return {
        id: question.id,
        correct: isCorrect,
        expectedAnswer: question.options[question.answer],
        explanation: question.explanation,
      };
    });
    const score = Math.round(correct / assessment.questions.length * 100);
    const passed = score >= 70;
    const submittedAt = new Date().toISOString();
    await runDb(
      'INSERT INTO assessment_attempts (id, userId, assessmentId, score, passed, submittedAt) VALUES (?, ?, ?, ?, ?, ?)',
      [randomUUID(), req.user.id, assessment.id, score, passed ? 1 : 0, submittedAt]
    );
    if (passed) {
      await runDb(
        'UPDATE learning_progress SET completedAt = COALESCE(completedAt, ?) WHERE userId = ? AND day = ? AND dailyQuizPassed = 1 AND activityCompletedAt IS NOT NULL',
        [submittedAt, req.user.id, milestoneDay]
      );
    }
    const updated = await getProgress(req.user.id);
    await makeDashboardNotifications(req.user.id, updated);
    res.json({
      score,
      passed,
      passingScore: 70,
      feedback,
      message: passed
        ? `Assessment passed. Day ${milestoneDay} is complete and the next day is unlocked.`
        : 'Assessment not passed yet. Review the feedback and retry.',
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({ message: 'Unable to submit this assessment right now.' });
  }
});

app.patch('/api/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    const result = await runDb(
      'UPDATE notifications SET readAt = COALESCE(readAt, ?) WHERE id = ? AND userId = ?',
      [new Date().toISOString(), req.params.id, req.user.id]
    );
    if (!result.changes) return res.status(404).json({ message: 'Notification not found.' });
    res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Notification update error:', error);
    res.status(500).json({ message: 'Unable to update this notification right now.' });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedPassword = String(password);

  if (trimmedName.length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters long.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (trimmedPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  try {
    const existingUser = await getDb('SELECT id FROM users WHERE email = ?', [trimmedEmail]);

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
    const newUser = {
      id: randomUUID(),
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await runDb(
      'INSERT INTO users (id, name, email, password, createdAt) VALUES (?, ?, ?, ?, ?)',
      [newUser.id, newUser.name, newUser.email, newUser.password, newUser.createdAt]
    );

    const token = createToken(newUser);
    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email };

    res.status(201).json({
      message: 'User created successfully.',
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Unable to create user right now.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const trimmedEmail = String(email).trim().toLowerCase();
  const trimmedPassword = String(password);

  try {
    const user = await getDb('SELECT * FROM users WHERE email = ?', [trimmedEmail]);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isPasswordValid = await bcrypt.compare(trimmedPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = createToken(user);

    res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Unable to sign in right now.' });
  }
});




initializeDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Algorithm Hub backend running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    process.exit(1);
  });
