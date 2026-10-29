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
npm install
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
npm install
npm run build
npm run preview
```

Keep the backend running in another terminal. The preview server proxies `/api` to port 5000. For a real public deployment, configure `JWT_SECRET` to a long, random secret and set `FRONTEND_ORIGINS` to the exact trusted frontend origins. Do not use the development secret in production.

## Test the backend

With the backend running, open `http://localhost:5000/api/health`. The expected JSON includes `"status":"ok"`. Registration and login use `/api/register` and `/api/login`; registered users are stored in `backend/data/algorithm-hub.db`.

Run the backend API tests from `backend`:

```bash
npm test
```

The tests launch an isolated temporary SQLite database and verify registration and login rejection cases, authentication, user isolation, sequential unlocking, activity and quiz validation, all four milestone assessments (including failed attempts and retry), progress persistence, and logout revocation.

## Main pages

- `index.html` — Home and learning feature demonstrations
- `algorithms.html` — searchable algorithm library
- `explanation.html` — algorithm explanations and learning resources
- `visualizer.html` — sorting, searching, graph, and tree visualizations
- `practice.html` — coding practice workspace
- `signup.html` and `signin.html` — account registration and login
- `profile.html` — authenticated student dashboard and 30-day learning program
- `about.html` — project overview

## Important implementation notes

- `JWT_SECRET` is required in production and must be a long, random secret. The local-only default is not suitable for deployment.
- Dashboard data, lesson starts, activity confirmations, quiz attempts, completion, notifications, and revoked sessions are stored in SQLite and scoped to the authenticated account.
- The curriculum has 30 sequential days with six lesson stages: learn, understand, visualize, practice, quiz, and review. Each daily quiz has 10 questions (300 total), four choices per question, hints, and answer explanations; the server grades each attempt and requires at least 70%.
- Days 7, 14, 21, and 30 also require a separate, 10-question milestone assessment. Its questions are distinct from the daily quiz bank, scores and retry history are stored separately, and the milestone day does not complete until both quizzes pass.
- Practical activities require a submitted result to match a server-side test case. The dashboard does not execute arbitrary submitted source code or verify that the student wrote a program; the existing Practice Lab remains the separate online compiler experience.
- The dashboard shows quiz and assessment attempt history, weekly results, per-day topic averages, recent learning activity, and persisted notifications. Notifications are generated when the dashboard loads; there is no background scheduler, date-based deadline, overdue status, or email delivery.
- Sign-in keeps a session only for the current browser tab unless “Keep me signed in” is selected. Password reset email is not configured; the sign-in page displays this limitation instead of claiming to send a reset link.
- The algorithm catalog has 93 entries. Twelve have structured best/average/worst/space metadata; remaining catalog-only entries explicitly mark those bounds as undocumented instead of presenting unverified values as facts. Quick Sort stack space and the differing Dijkstra implementations are called out in the complexity audit.
- The coding practice workspace sends submitted code to the public Wandbox compiler API. Do not submit passwords, API keys, personal information, or other secrets in code.
- External fonts, icons, and the online compiler need an internet connection. The site itself is not yet deployed to a public hosting provider by this ZIP.

## Troubleshooting

- **`npm` or `node` is not recognized:** install Node.js LTS and reopen the terminal.
- **Port 3000 or 5000 is busy:** stop the other application using that port before starting Algorithm Hub.
- **Login says it cannot reach the server:** ensure the backend terminal is running and `http://localhost:5000/api/health` responds.
- **Dashboard redirects to sign-in:** sign in through the existing account flow. The dashboard checks the signed JWT with the backend; browser-only demo tokens are not accepted.
- **Progress does not advance:** finish each lesson stage, submit the activity's expected test result, and score at least 70% on the 10-question daily quiz. At Days 7, 14, 21, and 30, also pass the separate milestone assessment.
- **Backend tests fail to start:** confirm Node.js 18 or newer is installed; the tests use Node's built-in test runner and fetch API.
- **Compiler doesn't run:** check the internet connection or use the external compiler link in the practice workspace.
- **Testing on a phone:** connect the phone and computer to the same trusted Wi-Fi, find the computer's IPv4 address with `ipconfig`, and open `http://COMPUTER-IP:3000` on the phone. This is for local-network testing, not public deployment.

## Final verification note

Run the backend suite from the `backend` directory with `npm test`; it uses a temporary database and covers progression through Day 30, including independent retries and passing outcomes for Days 7, 14, 21, and 30. Run the frontend production check from the project root with `npm run build`. A browser smoke check covered account creation/sign-in, both session-storage choices, dashboard and Day 1 lesson rendering, and the password-reset limitation at a 375 CSS-pixel viewport. The dashboard reload produced no browser console errors or failed API requests. Full browser/device acceptance and production deployment remain unverified.
