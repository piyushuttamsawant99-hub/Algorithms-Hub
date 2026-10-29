# SECTION 3.11: IMPORTANT SOURCE CODE OF THE PROJECT

This section documents important source-code files and architectural modules used in **Algorithm Hub**. The explanations below describe the system structure, data isolation, and runtime mechanics across the frontend and backend.

---

## 3.11.1 Frontend Structure

The frontend contains the HTML pages and JavaScript modules responsible for presenting content and implementing client-side functionality.

### Important Frontend Files

| File / Module | Purpose in Architecture |
| :--- | :--- |
| `index.html` | Main entry or home page showcasing platform features, supported languages, and an animated Bubble Sort teaser. |
| `algorithms.html` | Algorithm listing interface categorizing 93 algorithms across 12 distinct computer science domains. |
| `explanation.html` | Algorithm explanation interface providing problem definitions, step-by-step invariant analyses, and Big-O tables. |
| `visualizer.html` | Interactive algorithm visualization interface supporting sorting, searching, BST, and graph traversals. |
| `practice.html` | Programming practice interface with problem specifications, sample test cases, and multi-language compiler integration. |
| `profile.html` | Profile-related interface and authenticated 30-day student dashboard with progress radar charts and attempt histories. |
| `signin.html` | Login interface validating email format, verifying bcrypt password hashes via backend API, and saving session tokens. |
| `signup.html` | Registration interface capturing student name, email, and password with validation and conflict handling. |
| `about.html` | Project information page documenting pedagogical background, tech stack, and academic attribution. |
| `script.js` | General frontend behaviour managing navbar responsiveness, theme toggling, auth checks, and mobile menus. |
| `algorithms.js` | Algorithm listing and related logic for real-time search filtering, dynamic card rendering, and difficulty badges. |
| `visualizer.js` | Visualizer interface behaviour handling playback controls (play, pause, step, speed) and input bindings. |
| `visualizer-core.js` | Core visualization functionality including animation state buffers, time step loops, and DOM bar rendering. |
| `practice.js` | Practice-page behaviour managing language tabs, code template generation, and input synchronization. |
| `practice-app.js` | Practice application functionality relaying source code to the remote Wandbox compiler API. |
| `explanation.js` | Explanation-page behaviour managing language tab switches (Pseudocode, C++, Java, Python, JS) and copy controls. |
| `Algorithm Category Data Modules` | Organized algorithm content across 12 modular ES6 data files (`data/*.js`) containing metadata and complexities. |

---

## 3.11.2 Algorithm Data Modules

The algorithm data modules organize the information used to present algorithms and their categories.

Their purpose is to keep learning content separate from general page structure and interaction logic. A modular arrangement makes it easier to maintain algorithm information and extend the application with additional content without altering the rendering pipeline.

* **Source References:** `data/sorting.js`, `data/searching.js`, `data/graphs.js`, and `data/explanations.js`. These modules provide catalog entries, algorithm explanations, and complexity data.

### Source Code Excerpt: `data/sorting.js`
```javascript
// data/sorting.js - Modular Algorithm Taxonomy and Complexity Bounds
window.algorithmGroups = window.algorithmGroups || {};
window.algorithmGroups.sorting = {
  label: 'Sorting',
  items: [
    ['Bubble Sort', 'Compares adjacent values and swaps them when out of order.', 'Best O(n) with early exit; average/worst O(n²)', 'O(1) auxiliary space'],
    ['Selection Sort', 'Finds the smallest remaining value and places it next.', 'O(n²) in all cases', 'O(1) auxiliary space'],
    ['Insertion Sort', 'Builds a sorted prefix by inserting each new value.', 'Best O(n); average/worst O(n²)', 'O(1) auxiliary space'],
    ['Merge Sort', 'Divides the array, sorts halves, and merges them.', 'O(n log n) in all cases', 'O(n) standard array merge auxiliary space'],
    ['Quick Sort', 'Partitions around a pivot and sorts both partitions recursively.', 'Average O(n log n); worst O(n²)', 'Average O(log n); worst O(n) recursion stack'],
    ['Heap Sort', 'Builds a binary heap and repeatedly extracts the maximum element.', 'O(n log n) in all cases', 'O(1) in-place auxiliary space']
  ]
};
```

---

## 3.11.3 Algorithm Visualizer Modules

The visualizer-related modules implement the interface and core behaviour of supported visualizations.
* `visualizer.js` is associated with visualizer-page behaviour, handling UI controls, slider changes, and input validation.
* `visualizer-core.js` contains core visualization functionality, including precomputing frame buffers, step-by-step playback, and DOM bar transitions.

* **Source References:** `visualizer.js` and `visualizer-core.js`. These modules connect visualizer controls to supported algorithm operations and display updates.

### Source Code Excerpt: `visualizer-core.js`
```javascript
// visualizer-core.js - Animation State Machine & Frame Buffer
export class VisualizerCore {
  constructor(canvasContainer, options = {}) {
    this.container = typeof canvasContainer === 'string' 
      ? document.querySelector(canvasContainer) 
      : canvasContainer;
    this.speed = options.speed || 300;
    this.historyFrames = [];
    this.currentFrameIdx = 0;
    this.isPlaying = false;
    this.timer = null;
  }

  pushFrame(snapshot) {
    this.historyFrames.push({
      array: [...snapshot.array],
      highlightIndices: [...(snapshot.highlights || [])],
      swappingIndices: [...(snapshot.swaps || [])],
      sortedIndices: [...(snapshot.sorted || [])]
    });
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.runLoop();
  }

  pause() {
    this.isPlaying = false;
    clearTimeout(this.timer);
  }

  stepForward() {
    if (this.currentFrameIdx < this.historyFrames.length - 1) {
      this.currentFrameIdx++;
      this.renderFrame(this.historyFrames[this.currentFrameIdx]);
    }
  }

  runLoop() {
    if (!this.isPlaying) return;
    if (this.currentFrameIdx < this.historyFrames.length - 1) {
      this.stepForward();
      this.timer = setTimeout(() => this.runLoop(), this.speed);
    } else {
      this.pause();
    }
  }

  renderFrame(frame) {
    if (!frame || !this.container) return;
    this.container.innerHTML = '';
    const maxVal = Math.max(...frame.array, 1);

    frame.array.forEach((val, idx) => {
      const bar = document.createElement('div');
      bar.className = 'visualizer-bar';
      bar.style.height = `${(val / maxVal) * 100}%`;
      
      if (frame.sortedIndices.includes(idx)) bar.classList.add('is-sorted');
      else if (frame.swappingIndices.includes(idx)) bar.classList.add('is-swapping');
      else if (frame.highlightIndices.includes(idx)) bar.classList.add('is-comparing');

      const label = document.createElement('span');
      label.innerText = val;
      bar.appendChild(label);
      this.container.appendChild(bar);
    });
  }
}
```

---

## 3.11.4 Practice Modules

The practice modules support the coding-practice interface and related interactions.

The browser submits code to the public Wandbox compile API; compiler availability depends on network access and the external service.

* **Source Reference:** `practice-app.js`. The browser sends code to Wandbox; the application displays output, execution time, and diagnostics returned by the external compile service.

### Source Code Excerpt: `practice-app.js`
```javascript
// practice-app.js - Multi-Language Compiler Integration
export class PracticeCompilerClient {
  constructor() {
    this.apiEndpoint = 'https://wandbox.org/api/compile.json';
    this.compilerByLanguage = {
      python: { compiler: 'cpython-3.13.8', file: 'main.py' },
      javascript: { compiler: 'nodejs-20.17.0', file: 'main.js' },
      java: { compiler: 'openjdk-jdk-21+35', file: 'Main.java' },
      c: { compiler: 'gcc-13.2.0-c', file: 'main.c' },
      cpp: { compiler: 'gcc-13.2.0', file: 'main.cpp' }
    };
  }

  async compileAndRun(language, sourceCode, stdinInput = '') {
    const config = this.compilerByLanguage[language];
    if (!config) throw new Error(`Unsupported programming language: ${language}`);

    const payload = {
      compiler: config.compiler,
      code: sourceCode,
      stdin: stdinInput,
      'compiler-option-raw': language === 'cpp' ? '-O2\n-std=c++20' : ''
    };

    const startTime = performance.now();
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      const result = await response.json();
      const elapsedMs = Math.round(performance.now() - startTime);

      return {
        status: result.status === '0' ? 'SUCCESS' : 'RUNTIME_ERROR',
        stdout: result.program_output || result.program_message || '',
        stderr: result.compiler_error || result.program_error || '',
        executionTimeMs: elapsedMs
      };
    } catch (error) {
      return {
        status: 'CONNECTION_FAILURE',
        stdout: '',
        stderr: `Failed to contact compiler service: ${error.message}`,
        executionTimeMs: Math.round(performance.now() - startTime)
      };
    }
  }
}
```

---

## 3.11.5 Backend Server

The backend is developed using Node.js and Express. Its server code defines API endpoints and handles the requests supported by the application.

* **Source Reference:** `backend/server.js`. It defines the health, account, protected learning, dashboard, quiz, assessment, notification, and logout endpoints.

### Verified Backend API Routes

| Endpoint & HTTP Method | Access Level | Functional Responsibility |
| :--- | :--- | :--- |
| `GET /api/health` | Public | Returns backend health status (`{"status":"ok"}`). |
| `POST /api/register` | Public | Creates an account after validating submitted fields and hashing password. |
| `POST /api/login` | Public | Authenticates an account and returns a signed 7-day JWT token. |
| `POST /api/logout` | Bearer Auth | Records the authenticated token's SHA-256 hash as revoked. |
| `GET /api/dashboard` | Bearer Auth | Returns progress data, streak stats, and notifications scoped to authenticated user. |
| `GET /api/learning/:day` | Bearer Auth | Returns lesson, activity test cases, and quiz data for an unlocked day. |
| `POST /api/learning/:day/concept` | Bearer Auth | Records completion of the concept reading stage. |
| `POST /api/learning/:day/start` | Bearer Auth | Records the initial lesson start timestamp. |
| `POST /api/learning/:day/activity` | Bearer Auth | Validates submitted activity answer against server test case. |
| `POST /api/learning/:day/quiz` | Bearer Auth | Grades 10-question daily quiz; unlocks next day if score &ge; 70%. |
| `GET /api/assessments/:assessmentId` | Bearer Auth | Retrieves 10 authored milestone assessment questions (Days 7, 14, 21, 30). |
| `POST /api/assessments/:assessmentId/quiz` | Bearer Auth | Evaluates milestone assessment; day completes only when both daily and milestone pass. |
| `PATCH /api/notifications/:id/read` | Bearer Auth | Marks an authenticated user notification as read. |

---

## 3.11.6 Authentication and Password Handling

The backend implements account registration, password hashing, login, signed tokens, protected routes, and token revocation.

* **Password Hashing:** Passwords are encrypted with `bcryptjs` using 10 salt rounds prior to persistence.
* **Token Verification:** Protected routes extract the Bearer token, verify cryptographic signature with `JWT_SECRET`, and reject tokens present in the `revoked_tokens` table.
* **Source Reference:** `backend/server.js`.

### Source Code Excerpt: `backend/server.js`
```javascript
// backend/server.js - Authentication & Revocation Verification
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createHash } from 'node:crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'local-development-secret-key';

export const createToken = (user) => jwt.sign(
  { id: user.id, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

export const requireAuth = async (req, res, next) => {
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ message: 'Sign in to access your learning dashboard.' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const revoked = await getDb('SELECT tokenHash FROM revoked_tokens WHERE tokenHash = ?', [tokenHash]);
    if (revoked) return res.status(401).json({ message: 'This session has been signed out. Please sign in again.' });

    const user = await getDb('SELECT id, name, email FROM users WHERE id = ?', [payload.id]);
    if (!user) return res.status(401).json({ message: 'Your session is no longer valid.' });

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Your session is invalid or expired.' });
  }
};
```

---

## 3.11.7 Database Integration

The backend initializes seven SQLite tables and uses parameterized SQL for database queries to prevent SQL injection.

* **Source Reference:** `backend/server.js`. It initializes the seven SQLite tables and uses parameterized SQL statements for database queries.

### Source Code Excerpt: `backend/server.js`
```javascript
// backend/server.js - Parameterized Database Operations
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(process.env.DB_PATH || './data/algorithm-hub.db');

export const runDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function (err) {
    if (err) return reject(err);
    resolve({ id: this.lastID, changes: this.changes });
  });
});

export const getDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) return reject(err);
    resolve(row);
  });
});

export const allDb = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) return reject(err);
    resolve(rows);
  });
});

export const initializeDb = async () => {
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
      conceptCompletedAt TEXT,
      activityCompletedAt TEXT,
      dailyQuizPassed INTEGER NOT NULL DEFAULT 0,
      latestScore REAL NOT NULL DEFAULT 0,
      completedAt TEXT,
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
};
```

---

## 3.11.8 Project Configuration

The project's package configuration identifies dependencies and scripts used to run or develop the application.

* **Configuration References:** `package.json`, `backend/package.json`, and `vite.config.mjs`.

### Frontend Configuration (`package.json`)
```json
{
  "name": "algorithm-hub-frontend",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 3000",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0 --port 4173"
  },
  "devDependencies": {
    "vite": "^5.4.10"
  }
}
```

### Backend Configuration (`backend/package.json`)
```json
{
  "name": "algorithm-hub-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js",
    "test": "node --test"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "sqlite3": "^5.1.7"
  }
}
```

### Vite Build & Reverse Proxy Configuration (`vite.config.mjs`)
```javascript
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  preview: {
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), "index.html"),
        about: resolve(process.cwd(), "about.html"),
        algorithms: resolve(process.cwd(), "algorithms.html"),
        explanation: resolve(process.cwd(), "explanation.html"),
        practice: resolve(process.cwd(), "practice.html"),
        profile: resolve(process.cwd(), "profile.html"),
        signin: resolve(process.cwd(), "signin.html"),
        signup: resolve(process.cwd(), "signup.html"),
        visualizer: resolve(process.cwd(), "visualizer.html")
      }
    }
  }
});
```
