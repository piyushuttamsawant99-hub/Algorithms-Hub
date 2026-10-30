# Algorithm Hub — Final Project Package

Algorithm Hub is a multi-page web learning project for algorithm explanations, interactive visualizations, and coding practice. The frontend uses HTML, CSS, JavaScript, and Vite. The backend uses Node.js, Express, SQLite, bcryptjs, and JWT.

## Quick start on Windows

1. Install **Node.js LTS** from https://nodejs.org/ (npm is included).
2. Extract the complete ZIP into a normal writable folder, for example `C:\\Projects\\Algorithm-Hub-Final`.
3. Double-click **`START-ALGORITHM-HUB.bat`**.
4. On first run, the script installs the dependencies, then opens separate backend and frontend terminal windows.
5. Open **http://localhost:3000** in Chrome, Edge, or Firefox.
6. Keep both terminal windows open while using the website.

If Windows asks to allow Node.js through the firewall, allow it only on a trusted private network if you want to test from another device on the same Wi-Fi.

## Manual start (Windows, macOS, or Linux)

Open two terminals in the project folder.

**Terminal 1 — backend:**

```bash
cd backend
npm ci
npm run dev
```

**Terminal 2 — frontend:**

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Do not open the HTML files directly using `file://` and do not use a static Live Server for authentication; `/api` requests need the Vite proxy and backend.

## Production build check

From the project root:

```bash
npm ci
npm run build
npm run preview
```

Keep the backend running in another terminal. The preview server proxies `/api` to port 5000. For a real public deployment, configure `JWT_SECRET` to a long, random secret and set `FRONTEND_ORIGINS` to the exact trusted frontend origins. Do not use the development secret in production.

## Test the backend

With the backend running, open `http://localhost:5000/api/health`. The expected JSON includes `"status":"ok"`. Registration and login use `/api/register` and `/api/login`; registered users are stored in `backend/data/algorithm-hub.db`.

Run the backend API and SQLite tests from `backend`:

```bash
npm test
```

The tests launch isolated temporary SQLite databases and verify content-row parity and seed idempotency, catalog API reads, registration and login rejection cases, authentication, user isolation, sequential unlocking, activity and quiz validation, all four milestone assessments (including failed attempts and retry), progress persistence across restart, and logout revocation.

## Main pages

- `index.html` — Home and learning feature demonstrations
- `algorithms.html` — searchable algorithm library
- `explanation.html` — algorithm explanations and learning resources
- `visualizer.html` — sorting, searching, graph, and tree visualizations
- `practice.html` — coding practice workspace
- `signup.html` and `signin.html` — account registration and login
- `profile.html` — authenticated student dashboard and 30-day learning program
- `about.html` — project overview

## Project documentation

- `SOFTWARE_ENGINEERING_DOCUMENTATION.md` — implementation-aligned architecture, data-flow, ER, activity, component, and use-case diagrams.
- `DIAGRAMS_AND_DESCRIPTIONS.html` — browser-viewable project diagrams.
- `FINAL_PROJECT_REPORT_SUBMISSION/FINAL_PROJECT_REPORT.md` and `.html` — corrected final report; the Markdown version is the editable source.
- `FINAL_PROJECT_REPORT_SUBMISSION/SECTION_3_11_IMPORTANT_SOURCE_CODE.md` and `.html` — verified source-module and API map.
- `FINAL-AUDIT-AND-STATUS.md` — final verification results and remaining limitations.

The legacy `algo.docx` copies are retained in the working project but are not part of the distributable package; the corrected report is provided in Markdown and HTML.

## Important implementation notes

- `JWT_SECRET` is required in production and must be a long, random secret. The local-only default is not suitable for deployment.
- Dashboard data, lesson starts, activity confirmations, quiz attempts, completion, notifications, and revoked sessions are stored in SQLite and scoped to the authenticated account.
- The SQLite database is the runtime source for the 93 algorithm catalog entries, all 30 lessons, 30 daily quizzes, and four milestone assessments (340 questions total). On backend startup, the existing catalog, curriculum, and quiz-bank source files are validated and transactionally upserted into `algorithms`, `lessons`, `quizzes`, and `quiz_questions`. Source files remain available as migration/seed inputs; application API reads use SQLite.
- The database currently contains 11 tables: `users`, `learning_progress`, `quiz_attempts`, `notifications`, `revoked_tokens`, `activity_attempts`, `assessment_attempts`, `algorithms`, `lessons`, `quizzes`, and `quiz_questions`. A fresh database is initialized by the backend; the tracked local database is not required for setup.
- SQLite initialization enables foreign keys, WAL journaling, and a busy timeout. Content seeding is idempotent and does not recreate or overwrite user accounts or progress tables. This checkout contains a tracked local database; it is excluded from the distributable ZIP, and a fresh database is created and seeded automatically when the backend starts. Avoid adding real user data to the tracked database.
- The curriculum has 30 sequential days with six lesson stages: learn, understand, visualize, practice, quiz, and review. Each daily quiz has 10 questions (300 total), four choices per question, hints, and answer explanations; the server grades each attempt and requires at least 70%.
- Days 7, 14, 21, and 30 also require a separate, 10-question milestone assessment. Its questions are distinct from the daily quiz bank, scores and retry history are stored separately, and the milestone day does not complete until both quizzes pass.
- Practical activities require a submitted result to match a server-side test case. The dashboard does not execute arbitrary submitted source code or verify that the student wrote a program; the existing Practice Lab remains the separate online compiler experience.
- The dashboard shows quiz and assessment attempt history, weekly results, per-day topic averages, recent learning activity, and persisted notifications. Notifications are generated when the dashboard loads; there is no background scheduler, date-based deadline, overdue status, or email delivery.
- Sign-in keeps a session only for the current browser tab unless “Keep me signed in” is selected. Password reset email is not configured; the sign-in page displays this limitation instead of claiming to send a reset link.
- The algorithm catalog has 93 entries. Each card displays time and auxiliary-space metadata with implementation assumptions where relevant. Quick Sort stack space and the differing Dijkstra implementations are called out in the complexity audit.
- The coding practice workspace sends submitted code to the public Wandbox compiler API. Do not submit passwords, API keys, personal information, or other secrets in code.
- External fonts, icons, and the online compiler need an internet connection. The site itself is not yet deployed to a public hosting provider by this ZIP.

## Troubleshooting

- **`npm` or `node` is not recognized:** install Node.js LTS and reopen the terminal.
- **Port 3000 or 5000 is busy:** stop the other application using that port before starting Algorithm Hub.
- **Login says it cannot reach the server:** ensure the backend terminal is running and `http://localhost:5000/api/health` responds.
- **Dashboard redirects to sign-in:** sign in through the existing account flow. The dashboard checks the signed JWT with the backend; browser-only demo tokens are not accepted.
- **Progress does not advance:** finish each lesson stage, submit the activity's expected test result, and score at least 70% on the 10-question daily quiz. At Days 7, 14, 21, and 30, also pass the separate milestone assessment.
- **Backend tests fail to start:** confirm Node.js 18 or newer is installed; the tests use Node's built-in test runner and fetch API.
- **Dependency installation fails or a native module is incompatible:** delete neither source files nor lockfiles; run `npm ci` in the project root and `backend` so each platform installs its own dependencies from the checked-in lockfiles.
- **Compiler doesn't run:** check the internet connection or use the external compiler link in the practice workspace.
- **Testing on a phone:** connect the phone and computer to the same trusted Wi-Fi, find the computer's IPv4 address with `ipconfig`, and open `http://COMPUTER-IP:3000` on the phone. This is for local-network testing, not public deployment.

## Final verification note

Final review checks run on 2026-10-30: `npm test` from `backend` passed all 3 tests (0 failed); JavaScript syntax checks passed for 29 project files; and the Vite production build completed successfully in a temporary output directory. Vite emitted warnings for classic script tags that it does not bundle; those scripts remain loaded at runtime. Browser/device acceptance, live Wandbox compilation, and production deployment were not run as part of this review.
