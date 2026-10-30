# Algorithm Hub — Submission and Demonstration Checklist

## Start and verify

- [ ] Install Node.js LTS and extract the ZIP into a writable folder.
- [ ] Run `START-ALGORITHM-HUB.bat`; keep the frontend and backend terminal windows open.
- [ ] Verify `http://localhost:5000/api/health` returns a healthy status.
- [ ] Open `http://localhost:3000` and check navigation, the algorithm library, explanations, visualizers, and practice lab.
- [ ] Register a new account, sign out, and sign in again.

## Student learning flow

- [ ] Open Day 1 and advance through its learn, understand, visualize, practice, quiz, and review stages.
- [ ] Use the activity hint, submit a wrong result, then submit the expected result.
- [ ] Answer all 10 daily questions; verify the answered counter, quiz hints, explanations, and score.
- [ ] Fail the daily quiz and confirm Day 2 stays locked.
- [ ] Retry with a passing score, refresh the page, and confirm Day 2 unlocks and attempt history persists.
- [ ] At Days 7, 14, 21, and 30, pass each daily quiz and separate milestone assessment; verify the next day unlocks only after both pass (Days 7, 14, and 21).
- [ ] Verify attempt history, weekly performance, topic insights, activity timeline, and read-notification persistence.
- [ ] Sign out and confirm the revoked session cannot reopen the dashboard.
- [ ] Check a narrow viewport and an additional browser on the target computer.

## Automated checks

- From the `backend` directory, run `npm test` for SQLite content migration/parity/idempotency, catalog API, curriculum validation, API progression and account-isolation tests, all four milestone gates, and the 93-entry complexity metadata audit.
- Run `npm run build` from the project root for the Vite production bundle.
- Run `node --check` on changed JavaScript if further edits are made.

## Explain limitations accurately

- Daily quizzes contain 10 questions each (300 total); four distinct milestone assessments contain 10 questions each.
- Activities validate one submitted result against a server-side expected output; the dashboard does not execute student-submitted code.
- Automated integration tests exercise Days 7, 14, 21, and 30 separately. Perform the browser checklist above to verify the interactive frontend flow.
- All 93 algorithm catalog entries are stored in SQLite and include card-ready time and auxiliary-space metadata.
- Notifications are generated on dashboard loads. There is no email delivery, scheduled reminder service, deadline, or overdue status.
- The Practice Lab relies on the external Wandbox service and internet access.
- This is a local runnable package, not a public production deployment; production security and deployment configuration remain necessary.
