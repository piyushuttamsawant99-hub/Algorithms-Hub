import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { curriculum } from './curriculum.js';
import { assessments } from './quiz-bank.js';

const backendDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.dirname(backendDirectory);
const categoryOrder = [
  'searching',
  'sorting',
  'arrays',
  'recursion',
  'linked-lists',
  'stack-queue',
  'tree',
  'graph',
  'dynamic',
  'greedy',
  'math-bit',
  'advanced',
];
const catalogFiles = [
  'searching.js',
  'sorting.js',
  'arrays-strings.js',
  'recursion.js',
  'linked-lists.js',
  'stack-queue.js',
  'trees.js',
  'graphs.js',
  'dynamic-programming.js',
  'greedy.js',
  'math-bit.js',
  'advanced.js',
];
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const parseJson = value => JSON.parse(value);

async function loadAlgorithmGroups() {
  const context = { window: {} };
  for (const file of catalogFiles) {
    const source = await readFile(path.join(projectDirectory, 'data', file), 'utf8');
    vm.runInNewContext(source, context, { filename: file });
  }
  const groups = context.window.algorithmGroups;
  if (!groups || categoryOrder.some(key => !groups[key]?.items?.length)) {
    throw new Error('Algorithm catalog source is incomplete; content migration was not seeded.');
  }
  return groups;
}

function contentQuestionInsert(question, quizId, position) {
  return [
    quizId,
    question.id,
    position,
    question.prompt,
    JSON.stringify(question.options),
    question.answer,
    question.hint,
    question.explanation,
  ];
}

export async function initializeContentStore({ runDb, getDb, allDb }) {
  await runDb(`
    CREATE TABLE IF NOT EXISTS algorithms (
      slug TEXT PRIMARY KEY,
      categoryKey TEXT NOT NULL,
      categoryLabel TEXT NOT NULL,
      position INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      timeComplexity TEXT NOT NULL,
      auxiliarySpace TEXT NOT NULL,
      UNIQUE(categoryKey, name)
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS lessons (
      day INTEGER PRIMARY KEY CHECK(day BETWEEN 1 AND 30),
      title TEXT NOT NULL,
      level TEXT NOT NULL,
      minutes INTEGER NOT NULL,
      objectivesJson TEXT NOT NULL,
      explanation TEXT NOT NULL,
      exampleJson TEXT NOT NULL,
      steps TEXT NOT NULL,
      activity TEXT NOT NULL,
      activityInput TEXT NOT NULL,
      activityHint TEXT NOT NULL,
      activityExpectedAnswer TEXT NOT NULL,
      linksJson TEXT NOT NULL
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('daily', 'assessment')),
      day INTEGER,
      title TEXT NOT NULL,
      daysJson TEXT NOT NULL,
      FOREIGN KEY (day) REFERENCES lessons(day) ON DELETE CASCADE
    )
  `);
  await runDb(`
    CREATE TABLE IF NOT EXISTS quiz_questions (
      quizId TEXT NOT NULL,
      id TEXT NOT NULL,
      position INTEGER NOT NULL,
      prompt TEXT NOT NULL,
      optionsJson TEXT NOT NULL,
      answerIndex INTEGER NOT NULL,
      hint TEXT NOT NULL,
      explanation TEXT NOT NULL,
      PRIMARY KEY (quizId, id),
      UNIQUE (quizId, position),
      FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
    )
  `);

  const groups = await loadAlgorithmGroups();
  const algorithms = categoryOrder.flatMap(categoryKey => {
    const group = groups[categoryKey];
    return group.items.map((item, position) => {
      const [name, description, timeComplexity, auxiliarySpace] = item;
      if (![name, description, timeComplexity, auxiliarySpace].every(value => typeof value === 'string' && value.trim())) {
        throw new Error(`Algorithm content is incomplete for ${name || `entry ${position + 1}`}.`);
      }
      return {
        slug: slug(name),
        categoryKey,
        categoryLabel: group.label,
        position,
        name,
        description,
        timeComplexity,
        auxiliarySpace,
      };
    });
  });
  if (algorithms.length !== 93 || new Set(algorithms.map(item => item.slug)).size !== algorithms.length) {
    throw new Error(`Expected 93 unique algorithms, found ${algorithms.length}.`);
  }

  if (curriculum.length !== 30 || curriculum.some(day => day.quiz.length !== 10)) {
    throw new Error('Expected 30 lessons with 10 daily quiz questions each.');
  }
  if (assessments.length !== 4 || assessments.some(assessment => assessment.questions.length !== 10)) {
    throw new Error('Expected four milestone assessments with 10 questions each.');
  }

  await runDb('BEGIN IMMEDIATE');
  try {
    for (const algorithm of algorithms) {
      await runDb(`
        INSERT INTO algorithms (slug, categoryKey, categoryLabel, position, name, description, timeComplexity, auxiliarySpace)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(slug) DO UPDATE SET
          categoryKey = excluded.categoryKey,
          categoryLabel = excluded.categoryLabel,
          position = excluded.position,
          name = excluded.name,
          description = excluded.description,
          timeComplexity = excluded.timeComplexity,
          auxiliarySpace = excluded.auxiliarySpace
      `, [
        algorithm.slug,
        algorithm.categoryKey,
        algorithm.categoryLabel,
        algorithm.position,
        algorithm.name,
        algorithm.description,
        algorithm.timeComplexity,
        algorithm.auxiliarySpace,
      ]);
    }

    for (const lesson of curriculum) {
      const { activityValidation } = lesson;
      await runDb(`
        INSERT INTO lessons (
          day, title, level, minutes, objectivesJson, explanation, exampleJson, steps, activity,
          activityInput, activityHint, activityExpectedAnswer, linksJson
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(day) DO UPDATE SET
          title = excluded.title,
          level = excluded.level,
          minutes = excluded.minutes,
          objectivesJson = excluded.objectivesJson,
          explanation = excluded.explanation,
          exampleJson = excluded.exampleJson,
          steps = excluded.steps,
          activity = excluded.activity,
          activityInput = excluded.activityInput,
          activityHint = excluded.activityHint,
          activityExpectedAnswer = excluded.activityExpectedAnswer,
          linksJson = excluded.linksJson
      `, [
        lesson.day,
        lesson.title,
        lesson.level,
        lesson.minutes,
        JSON.stringify(lesson.objectives),
        lesson.explanation,
        JSON.stringify(lesson.example),
        lesson.steps,
        lesson.activity,
        activityValidation.input,
        activityValidation.hint,
        activityValidation.expectedAnswer,
        JSON.stringify(lesson.links),
      ]);

      const quizId = `daily-${lesson.day}`;
      await runDb(`
        INSERT INTO quizzes (id, type, day, title, daysJson)
        VALUES (?, 'daily', ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET type = excluded.type, day = excluded.day, title = excluded.title, daysJson = excluded.daysJson
      `, [quizId, lesson.day, `Day ${lesson.day} Quiz`, JSON.stringify([lesson.day])]);
      await runDb('DELETE FROM quiz_questions WHERE quizId = ?', [quizId]);
      for (const [position, question] of lesson.quiz.entries()) {
        await runDb(`
          INSERT INTO quiz_questions (quizId, id, position, prompt, optionsJson, answerIndex, hint, explanation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, contentQuestionInsert(question, quizId, position));
      }
    }

    for (const assessment of assessments) {
      await runDb(`
        INSERT INTO quizzes (id, type, day, title, daysJson)
        VALUES (?, 'assessment', ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET type = excluded.type, day = excluded.day, title = excluded.title, daysJson = excluded.daysJson
      `, [assessment.id, assessment.days.at(-1), assessment.title, JSON.stringify(assessment.days)]);
      await runDb('DELETE FROM quiz_questions WHERE quizId = ?', [assessment.id]);
      for (const [position, question] of assessment.questions.entries()) {
        await runDb(`
          INSERT INTO quiz_questions (quizId, id, position, prompt, optionsJson, answerIndex, hint, explanation)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, contentQuestionInsert(question, assessment.id, position));
      }
    }
    await runDb('COMMIT');
  } catch (error) {
    await runDb('ROLLBACK');
    throw error;
  }

  const counts = await getDb(`
    SELECT
      (SELECT COUNT(*) FROM algorithms) AS algorithms,
      (SELECT COUNT(*) FROM lessons) AS lessons,
      (SELECT COUNT(*) FROM quizzes WHERE type = 'daily') AS dailyQuizzes,
      (SELECT COUNT(*) FROM quizzes WHERE type = 'assessment') AS assessments,
      (SELECT COUNT(*) FROM quiz_questions) AS questions
  `);
  if (counts.algorithms !== 93 || counts.lessons !== 30 || counts.dailyQuizzes !== 30 ||
      counts.assessments !== 4 || counts.questions !== 340) {
    throw new Error(`Content database verification failed: ${JSON.stringify(counts)}.`);
  }
}

export async function getAlgorithmGroups(allDb) {
  const rows = await allDb(`
    SELECT categoryKey, categoryLabel, name, description, timeComplexity, auxiliarySpace
    FROM algorithms
    ORDER BY CASE categoryKey
      WHEN 'searching' THEN 0 WHEN 'sorting' THEN 1 WHEN 'arrays' THEN 2 WHEN 'recursion' THEN 3
      WHEN 'linked-lists' THEN 4 WHEN 'stack-queue' THEN 5 WHEN 'tree' THEN 6 WHEN 'graph' THEN 7
      WHEN 'dynamic' THEN 8 WHEN 'greedy' THEN 9 WHEN 'math-bit' THEN 10 WHEN 'advanced' THEN 11
      ELSE 12 END, position
  `);
  const groups = {};
  for (const row of rows) {
    groups[row.categoryKey] ??= { label: row.categoryLabel, items: [] };
    groups[row.categoryKey].items.push([row.name, row.description, row.timeComplexity, row.auxiliarySpace]);
  }
  return groups;
}

export async function getQuizQuestions(allDb, quizId) {
  const rows = await allDb(
    'SELECT id, prompt, optionsJson, answerIndex, hint, explanation FROM quiz_questions WHERE quizId = ? ORDER BY position',
    [quizId]
  );
  return rows.map(row => ({
    id: row.id,
    prompt: row.prompt,
    options: parseJson(row.optionsJson),
    answer: row.answerIndex,
    hint: row.hint,
    explanation: row.explanation,
  }));
}

export async function getLessonContent(getDb, allDb, day) {
  const lesson = await getDb('SELECT * FROM lessons WHERE day = ?', [day]);
  if (!lesson) return null;
  const quiz = await getQuizQuestions(allDb, `daily-${day}`);
  return {
    day: lesson.day,
    title: lesson.title,
    level: lesson.level,
    minutes: lesson.minutes,
    objectives: parseJson(lesson.objectivesJson),
    explanation: lesson.explanation,
    example: parseJson(lesson.exampleJson),
    steps: lesson.steps,
    activity: lesson.activity,
    activityValidation: {
      input: lesson.activityInput,
      hint: lesson.activityHint,
      expectedAnswer: lesson.activityExpectedAnswer,
    },
    links: parseJson(lesson.linksJson),
    quiz,
  };
}

export function publicLesson(lesson) {
  const { quiz, activityValidation, ...content } = lesson;
  return {
    ...content,
    activityValidation: {
      input: activityValidation.input,
      hint: activityValidation.hint,
    },
    quiz: quiz.map(({ id, prompt, options, hint }, index) => ({ id, prompt, options, hint, number: index + 1 })),
  };
}

export async function getAssessmentRecord(getDb, allDb, id) {
  const assessment = await getDb("SELECT id, title, daysJson FROM quizzes WHERE id = ? AND type = 'assessment'", [id]);
  if (!assessment) return null;
  return {
    id: assessment.id,
    title: assessment.title,
    days: parseJson(assessment.daysJson),
    questions: await getQuizQuestions(allDb, assessment.id),
  };
}

export async function getLessonSummaries(allDb) {
  return allDb('SELECT day, title, level, minutes FROM lessons ORDER BY day');
}
