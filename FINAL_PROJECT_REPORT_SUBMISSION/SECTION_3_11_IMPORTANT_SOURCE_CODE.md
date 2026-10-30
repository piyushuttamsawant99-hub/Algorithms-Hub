# SECTION 3.11: IMPORTANT SOURCE CODE OF THE PROJECT

This appendix maps the implemented modules to their responsibilities. The repository source files are authoritative; this document intentionally avoids copied code excerpts that can drift from implementation.

## 3.11.1 Frontend and content modules

| File or directory | Implemented responsibility |
| --- | --- |
| `index.html`, `about.html`, `algorithms.html`, `explanation.html`, `visualizer.html`, `practice.html`, `signup.html`, `signin.html`, `profile.html` | Multi-page browser interface. |
| `script.js`, `learning-dashboard.js` | Shared navigation/authentication behavior and authenticated dashboard requests. |
| `algorithms.js`, `visualizer.js`, `visualizer-core.js`, `explanation.js` | Algorithm catalog, visualization, and explanation page behavior. |
| `practice-app.js`, `practice.js` | Practice Lab interface; `practice-app.js` sends compile requests directly from the browser to `https://wandbox.org/api/compile.json`. |
| `data/*.js` | Algorithm catalog and explanation content used by the frontend and catalog migration. |
| `backend/curriculum.js`, `backend/quiz-bank.js` | Lesson and quiz/assessment seed content. |

## 3.11.2 Backend and database

| File | Implemented responsibility |
| --- | --- |
| `backend/server.js` | Express API, registration/login/logout, JWT authentication, dashboard, learning progression, grading, notifications, and SQLite initialization. |
| `backend/content-store.js` | Creates and transactionally seeds the four content tables, validates content counts, and serves database-backed catalog, lesson, and quiz data. |
| `backend/test/*.test.js` | Node.js built-in test-runner coverage using temporary SQLite databases. |

The SQLite database has exactly 11 implemented tables: `users`, `learning_progress`, `quiz_attempts`, `notifications`, `revoked_tokens`, `activity_attempts`, `assessment_attempts`, `algorithms`, `lessons`, `quizzes`, and `quiz_questions`.

## 3.11.3 Implemented API routes

| Method and route | Access | Responsibility |
| --- | --- | --- |
| `GET /api/health` | Public | Backend/database health check. |
| `GET /api/algorithms`, `GET /api/algorithm-groups.js` | Public | Database-backed algorithm catalog. |
| `POST /api/register`, `POST /api/login` | Public | Account creation and password verification; returns a signed JWT. |
| `POST /api/logout`, `GET /api/dashboard` | Authenticated | Revoke current token and return account-scoped dashboard data. |
| `GET /api/learning/:day` | Authenticated | Load an unlocked lesson. |
| `POST /api/learning/:day/start`, `POST /api/learning/:day/concept` | Authenticated | Record lesson start and concept review. |
| `POST /api/learning/:day/activity`, `POST /api/learning/:day/quiz` | Authenticated | Validate the expected activity result and grade the daily quiz. |
| `GET /api/assessments/:assessmentId`, `POST /api/assessments/:assessmentId/quiz` | Authenticated | Load and grade a milestone assessment. |
| `PATCH /api/notifications/:id/read` | Authenticated | Mark an account-owned notification as read. |

## 3.11.4 Authentication, configuration, and test evidence

Passwords are hashed with bcryptjs. JWTs are signed with `JWT_SECRET`, expire after seven days, and are checked against SHA-256 token hashes in `revoked_tokens`. Production startup requires an explicitly configured secret. The backend uses parameterized SQLite queries and enables foreign keys.

Root `package.json` provides Vite development/build/preview scripts. `backend/package.json` provides the backend start, watch, and `node --test` scripts. See the README for installation, environment variables, and startup instructions.
