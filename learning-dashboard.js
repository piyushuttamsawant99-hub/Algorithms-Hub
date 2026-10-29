const root = document.getElementById("learningDashboard");
const token = sessionStorage.getItem("algorithmHubToken") || localStorage.getItem("algorithmHubToken");

function clearSession() {
    for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem("algorithmHubToken");
        storage.removeItem("algorithmHubUser");
        storage.removeItem("algorithmHubDemoMode");
    }
}

if (!token) {
    window.location.replace("signin.html?redirect=profile.html");
} else if (root) {
    const escapeHtml = (value) => String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);

    async function api(path, options = {}) {
        let response;
        try {
            response = await fetch(`/api${path}`, {
                ...options,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(options.body ? { "Content-Type": "application/json" } : {}),
                    ...options.headers,
                },
            });
        } catch {
            throw new Error("Cannot reach the learning service. Check that the backend is running.");
        }
        const data = await response.json().catch(() => ({}));
        if (response.status === 401) {
            clearSession();
            window.location.replace("signin.html?redirect=profile.html");
            throw new Error(data.message || "Your session has expired. Please sign in again.");
        }
        if (!response.ok) throw new Error(data.message || "The request could not be completed.");
        return data;
    }

    function initials(name) {
        return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();
    }

    function renderDashboard(data) {
        const firstName = data.user.name.trim().split(/\s+/)[0];
        const unread = data.notifications.filter(notification => !notification.readAt).length;
        const current = data.progress.find(item => item.day === data.currentDay);
        const strongestTopic = data.topicPerformance[0];
        const weakestTopic = data.topicPerformance.length > 1 ? data.topicPerformance[data.topicPerformance.length - 1] : null;
        const weeklySummary = data.weeklyPerformance.length
            ? data.weeklyPerformance.map(week => `<span class="learn-week-chip">Week ${week.week}: ${week.average}% · ${week.attempts} attempt${week.attempts === 1 ? "" : "s"}</span>`).join("")
            : '<p class="learn-empty">Weekly results will appear after your first quiz.</p>';
        const activitySummary = data.recentActivity.length
            ? data.recentActivity.map(activity => {
                const timestamp = activity.completedAt || activity.startedAt;
                const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(timestamp));
                return `<p class="learn-empty">Day ${activity.day} · ${escapeHtml(activity.title)} · ${escapeHtml(date)}${activity.completedAt ? " · Completed" : " · Started"}</p>`;
            }).join("")
            : '<p class="learn-empty">Your lesson activity will appear here after you start Day 1.</p>';
        const recentQuizAttempts = data.quizAttempts?.length
            ? data.quizAttempts.slice(0, 5).map(attempt => {
                const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(attempt.submittedAt));
                return `<p class="learn-empty">Day ${attempt.day} · ${attempt.score}% · ${attempt.passed ? "Passed" : "Retry available"} · ${escapeHtml(date)}</p>`;
            }).join("")
            : '<p class="learn-empty">No quiz attempts yet. Your first score will appear here after you take Day 1’s quiz.</p>';
        const recentAssessmentAttempts = data.assessmentAttempts?.length
            ? data.assessmentAttempts.slice(0, 5).map(attempt => {
                const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(attempt.submittedAt));
                return `<p class="learn-empty">${escapeHtml(attempt.title)} · ${attempt.score}% · ${attempt.passed ? "Passed" : "Retry available"} · ${escapeHtml(date)}</p>`;
            }).join("")
            : '<p class="learn-empty">Milestone assessment scores will appear here after your first assessment.</p>';
        const dayCards = data.progress.map(item => `
            <article class="learn-day-card" data-status="${escapeHtml(item.status)}">
                <button class="learn-day-button" type="button" data-day="${item.day}" ${item.status === "Locked" ? "disabled" : ""} aria-label="Day ${item.day}: ${escapeHtml(item.title)}, ${escapeHtml(item.status)}">
                    <span class="learn-day-number">DAY ${item.day} · ${item.minutes} MIN</span>
                    <span class="learn-day-title">${escapeHtml(item.title)}</span>
                    <span class="learn-day-status">${escapeHtml(item.status)}${item.latestScore ? ` · ${item.latestScore}% latest` : ""}</span>
                </button>
            </article>
        `).join("");
        const notificationList = data.notifications.length
            ? data.notifications.map(notification => `
                <div class="learn-notification ${notification.readAt ? "" : "unread"}">
                    <span>${escapeHtml(notification.message)}</span>
                    <span class="learn-notification-actions">
                        <button class="learn-small-button" type="button" data-open-day="${notification.day}">Open Day ${notification.day}</button>
                        ${notification.readAt ? "" : `<button class="learn-small-button" type="button" data-read="${escapeHtml(notification.id)}">Mark read</button>`}
                    </span>
                </div>
            `).join("")
            : '<p class="learn-empty">You are all caught up. New reminders appear when a lesson becomes available or you complete a day.</p>';

        root.innerHTML = `
            <section class="learn-welcome">
                <div>
                    <span class="section-label">YOUR 30-DAY LEARNING JOURNEY</span>
                    <h1>Welcome back, ${escapeHtml(firstName)}</h1>
                    <p>${data.completedDays === 30 ? "Congratulations on completing the full program!" : `Keep your momentum going: Day ${data.currentDay} is ${current?.status === "In Progress" ? "in progress" : "ready when you are"}.`}</p>
                    <div class="learn-progress-wrap">
                        <div class="learn-progress-label"><span>Program progress</span><strong>${data.progressPercent}% · ${data.completedDays}/30 days</strong></div>
                        <div class="learn-progress-track" role="progressbar" aria-label="30-day program progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${data.progressPercent}"><span style="width:${data.progressPercent}%"></span></div>
                    </div>
                </div>
                <div class="learn-avatar" aria-hidden="true">${escapeHtml(initials(data.user.name))}</div>
            </section>
            <section class="learn-metrics" aria-label="Learning statistics">
                <div class="learn-metric"><strong>${data.completedDays === 30 ? "Done" : `Day ${data.currentDay}`}</strong><span>Current learning day · ${escapeHtml(current?.level || "Advanced")}</span></div>
                <div class="learn-metric"><strong>${data.completedDays}</strong><span>Days completed · ${data.pendingDays} remaining</span></div>
                <div class="learn-metric"><strong>${data.quizAverage === null ? "—" : `${data.quizAverage}%`}</strong><span>Average quiz score</span></div>
                <div class="learn-metric"><strong>${data.streak} ${data.streak === 1 ? "day" : "days"}</strong><span>Learning streak · saved activity</span></div>
            </section>
            <div class="learn-columns">
                <section class="learn-panel" aria-labelledby="timelineTitle">
                    <h2 id="timelineTitle">Your learning timeline</h2>
                    <p class="learn-panel-subtitle">Days unlock in order. Complete the practical activity and pass the quiz with at least ${data.passingScore}% to move forward. Completed lessons stay open for revision.</p>
                    <div class="learn-day-grid">${dayCards}</div>
                </section>
                <aside class="learn-panel" aria-labelledby="accountTitle">
                    <h2 id="accountTitle">Your account</h2>
                    <p class="learn-panel-subtitle">${escapeHtml(data.user.name)}<br>${escapeHtml(data.user.email)}</p>
                    <p class="learn-panel-subtitle">Student account · progress saved to your account</p>
                    <h2 style="margin-top:24px">Notifications <span aria-label="${unread} unread">${unread ? `(${unread} unread)` : ""}</span></h2>
                    <div>${notificationList}</div>
                    <h2 style="margin-top:24px">Recent quiz attempts</h2>
                    ${recentQuizAttempts}
                    <h2 style="margin-top:20px">Milestone assessment attempts</h2>
                    ${recentAssessmentAttempts}
                    <h2 style="margin-top:20px">Topic insights</h2>
                    ${strongestTopic
                        ? `<p class="learn-empty">Strongest: Day ${strongestTopic.day} · ${escapeHtml(strongestTopic.title)} · ${strongestTopic.average}% average</p>`
                        : '<p class="learn-empty">Complete quizzes to identify your strongest and focus topics.</p>'}
                    ${weakestTopic ? `<p class="learn-empty">Focus next: Day ${weakestTopic.day} · ${escapeHtml(weakestTopic.title)} · ${weakestTopic.average}% average</p>` : ""}
                    <h2 style="margin-top:20px">Weekly performance</h2>
                    ${weeklySummary}
                    <h2 style="margin-top:20px">Recent learning activity</h2>
                    ${activitySummary}
                    <button class="learn-action-button" type="button" id="dashboardSignOut"><i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i> Sign out</button>
                </aside>
            </div>
            <div class="lesson-backdrop" id="lessonBackdrop" hidden>
                <section class="lesson-dialog" role="dialog" aria-modal="true" aria-labelledby="lessonTitle">
                    <div class="lesson-header"><div id="lessonContent"></div><button type="button" class="lesson-close" id="lessonClose" aria-label="Close lesson">Close</button></div>
                </section>
            </div>
        `;

        root.querySelectorAll("[data-day]").forEach(button => {
            button.addEventListener("click", () => openLesson(Number(button.dataset.day)));
        });
        root.querySelectorAll("[data-read]").forEach(button => {
            button.addEventListener("click", async () => {
                button.disabled = true;
                try {
                    await api(`/notifications/${encodeURIComponent(button.dataset.read)}/read`, { method: "PATCH" });
                    await loadDashboard();
                } catch (error) {
                    button.disabled = false;
                    showDashboardError(error);
                }
            });
        });
        root.querySelectorAll("[data-open-day]").forEach(button => {
            button.addEventListener("click", () => openLesson(Number(button.dataset.openDay)));
        });
        root.querySelector("#dashboardSignOut").addEventListener("click", async event => {
            const button = event.currentTarget;
            button.disabled = true;
            try {
                await api("/logout", { method: "POST" });
            } catch (error) {
                if (localStorage.getItem("algorithmHubToken") || sessionStorage.getItem("algorithmHubToken")) {
                    button.disabled = false;
                    showDashboardError(error);
                    return;
                }
            }
            clearSession();
            window.location.replace("index.html");
        });
        root.querySelector("#lessonClose").addEventListener("click", closeLesson);
        root.querySelector("#lessonBackdrop").addEventListener("click", event => {
            if (event.target.id === "lessonBackdrop") closeLesson();
        });
    }

    function showDashboardError(error) {
        const prior = root.querySelector(".dashboard-error");
        if (prior) prior.remove();
        const message = document.createElement("p");
        message.className = "dashboard-error";
        message.setAttribute("role", "alert");
        message.textContent = error.message;
        root.prepend(message);
    }

    async function loadDashboard() {
        root.setAttribute("aria-busy", "true");
        try {
            const data = await api("/dashboard");
            renderDashboard(data);
        } catch (error) {
            showDashboardError(error);
        } finally {
            root.removeAttribute("aria-busy");
        }
    }

    function closeLesson() {
        const backdrop = root.querySelector("#lessonBackdrop");
        if (backdrop) backdrop.hidden = true;
    }

    function setLessonError(message) {
        let error = root.querySelector("#lessonError");
        if (!error) {
            error = document.createElement("p");
            error.id = "lessonError";
            error.className = "lesson-error";
            error.setAttribute("role", "alert");
            root.querySelector("#lessonContent").append(error);
        }
        error.textContent = message;
    }

    let activeLesson = null;
    let selectedAnswers = {};
    let selectedAssessmentAnswers = {};
    let dailyFeedback = null;
    let assessmentFeedback = null;
    let activityFeedback = "";

    async function openLesson(day) {
        const backdrop = root.querySelector("#lessonBackdrop");
        const content = root.querySelector("#lessonContent");
        backdrop.hidden = false;
        content.innerHTML = '<p class="learn-empty">Loading lesson…</p>';
        activeLesson = null;
        selectedAnswers = {};
        selectedAssessmentAnswers = {};
        dailyFeedback = null;
        assessmentFeedback = null;
        activityFeedback = "";
        try {
            let result = await api(`/learning/${day}`);
            if (result.status !== "Completed") {
                await api(`/learning/${day}/start`, { method: "POST" });
                result = await api(`/learning/${day}`);
            }
            renderLesson(result, "concept");
        } catch (error) {
            content.innerHTML = `<p class="lesson-error" role="alert">${escapeHtml(error.message)}</p>`;
        }
    }

    function renderLesson(result, stage = "concept") {
        activeLesson = result;
        const { lesson, progress, passingScore, assessmentId, assessmentPassed } = result;
        const content = root.querySelector("#lessonContent");
        const conceptDone = Boolean(progress?.conceptCompletedAt);
        const activityDone = Boolean(progress?.activityCompletedAt);
        const quizDone = Boolean(progress?.dailyQuizPassed);
        const dayDone = Boolean(progress?.completedAt);
        const objectiveList = lesson.objectives.map(objective => `<li>${escapeHtml(objective)}</li>`).join("");
        const stageNames = [
            ["concept", "1 · Learn"],
            ["algorithm", "2 · Understand"],
            ["visualizer", "3 · Visualize"],
            ["practice", "4 · Practice"],
            ["quiz", "5 · Quiz"],
            ["review", "6 · Review"],
        ];
        const tabs = stageNames.map(([id, label]) => `
            <button type="button" class="lesson-stage-tab ${stage === id ? "active" : ""}" data-stage="${id}" aria-current="${stage === id ? "step" : "false"}">${label}</button>
        `).join("");
        const stageContent = {
            concept: `
                <h3>Learning objectives</h3><ul>${objectiveList}</ul>
                <h3>Concept</h3><p>${escapeHtml(lesson.explanation)}</p>
                <h3>Worked example</h3><p><strong>Input:</strong> ${escapeHtml(lesson.example.input)}<br><strong>Expected output:</strong> ${escapeHtml(lesson.example.output)}</p>
                <button type="button" class="learn-action-button" id="markConceptReviewed" ${conceptDone ? "disabled" : ""}>${conceptDone ? "Concept review saved" : "Mark concept reviewed"}</button>
            `,
            algorithm: `
                <h3>Step-by-step method</h3><pre>${escapeHtml(lesson.steps)}</pre>
                <h3>Learning pseudocode example</h3><pre>${escapeHtml(`// Learning example — not proof of task completion\n${lesson.steps}`)}</pre>
                ${lesson.links.explanation ? `<a class="learn-action-button" href="${escapeHtml(lesson.links.explanation)}" target="_blank" rel="noopener">Open algorithm explanation <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>` : '<p class="learn-empty">No separate explanation page is available for this topic; the steps above are the lesson explanation.</p>'}
            `,
            visualizer: lesson.links.visualizer
                ? `<p>Try the matching interactive trace. It opens separately so this lesson and its saved state remain available.</p><a class="learn-action-button" href="${escapeHtml(lesson.links.visualizer)}" target="_blank" rel="noopener">Open Visualizer <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>`
                : '<p class="learn-empty">There is no topic-specific visualizer configured for this day. Use the worked example and pseudocode to trace the method manually; opening another visualizer is not required for completion.</p>',
            practice: `
                <h3>Practical task</h3>
                <p>${escapeHtml(lesson.activity)}</p>
                <p><strong>Test input:</strong> <code>${escapeHtml(lesson.activityValidation.input)}</code></p>
                <p><strong>Sample:</strong> ${escapeHtml(lesson.example.input)} → ${escapeHtml(lesson.example.output)}</p>
                <p class="learn-empty">This activity validates the result of a guided trace; the learning server does not execute submitted source code. For code execution, use the existing Practice Lab and its external compiler.</p>
                <button type="button" class="learn-small-button" id="showActivityHint" aria-expanded="false">Show hint</button>
                <p class="learn-hint" id="activityHint" hidden>${escapeHtml(lesson.activityValidation.hint)}</p>
                <label class="lesson-answer-field">Your result
                    <input id="activityAnswer" type="text" maxlength="500" autocomplete="off" placeholder="Enter the expected result">
                </label>
                <button type="button" class="learn-action-button" id="submitActivity" ${activityDone ? "disabled" : ""}>${activityDone ? "Activity test passed" : "Check activity result"}</button>
                <p id="activityFeedback" class="learn-empty" aria-live="polite">${escapeHtml(activityDone ? "Saved activity test passed." : activityFeedback)}</p>
            `,
            quiz: `
                <p class="learn-panel-subtitle">10 topic-specific questions · pass with at least ${passingScore}%.</p>
                <p class="quiz-progress" id="quizProgress" aria-live="polite"></p>
                <form id="lessonQuiz">
                    ${lesson.quiz.map((question, index) => `
                        <fieldset class="lesson-quiz-question">
                            <legend>${index + 1}. ${escapeHtml(question.prompt)}</legend>
                            ${question.options.map((option, optionIndex) => `
                                <label><input type="radio" name="${question.id}" value="${optionIndex}" ${selectedAnswers[question.id] === optionIndex ? "checked" : ""} ${quizDone ? "disabled" : ""}> <span>${escapeHtml(option)}</span></label>
                            `).join("")}
                            <button type="button" class="learn-small-button" data-hint="${question.id}" aria-expanded="false">Show hint</button>
                            <p class="learn-hint" data-hint-content="${question.id}" hidden>${escapeHtml(question.hint)}</p>
                        </fieldset>
                    `).join("")}
                    <button class="learn-action-button" type="submit" ${!activityDone || quizDone ? "disabled" : ""}>${quizDone ? "Daily quiz passed" : dailyFeedback ? "Retry quiz" : "Submit daily quiz"}</button>
                </form>
                <div id="lessonResult" aria-live="polite"></div>
                ${dailyFeedback ? renderFeedback(dailyFeedback) : ""}
            `,
            review: `
                <h3>Completion requirements</h3>
                <ul class="lesson-checklist">
                    <li>${conceptDone ? "✓" : "○"} Concept studied and confirmed</li>
                    <li>${activityDone ? "✓" : "○"} Practical test case passed</li>
                    <li>${quizDone ? "✓" : "○"} Daily quiz passed (70% or higher)</li>
                    ${assessmentId ? `<li>${assessmentPassed ? "✓" : "○"} ${escapeHtml(assessmentId)} milestone assessment passed</li>` : ""}
                    <li>${dayDone ? "✓" : "○"} Day completion saved</li>
                </ul>
                ${assessmentId && quizDone && !assessmentPassed ? `<button type="button" class="learn-action-button" id="startAssessment">Take separate milestone assessment</button>` : ""}
                ${assessmentFeedback ? renderFeedback(assessmentFeedback) : ""}
                ${dayDone
                    ? `<div class="lesson-result" data-passed="true"><strong>Congratulations! Day ${lesson.day} is complete.</strong><p>Your completion is saved. ${lesson.day < 30 ? `Day ${lesson.day + 1} — ${escapeHtml(result.nextDayTitle || "Next lesson")} — is now unlocked.` : "You have completed the full program."}</p></div>
                       ${lesson.day < 30 ? `<button type="button" class="learn-action-button" id="nextLearningDay">Next Day</button>` : ""}
                       <button type="button" class="lesson-close inline-close" data-close-lesson>Back to dashboard</button>`
                    : `<p class="learn-empty">Complete each remaining requirement to finish this day. ${!conceptDone ? "Review the concept first. " : ""}${!activityDone ? "Pass the practical test case. " : ""}${!quizDone ? "Pass the daily quiz. " : ""}${assessmentId && !assessmentPassed ? "Pass the separate milestone assessment. " : ""}</p>`}
            `,
        }[stage];
        content.innerHTML = `
            <div class="lesson-header">
                <div>
                    <span class="section-label">DAY ${lesson.day} · ${escapeHtml(lesson.level)} · ${lesson.minutes} MIN</span>
                    <h2 id="lessonTitle">${escapeHtml(lesson.title)}</h2>
                </div>
                <button type="button" class="lesson-close" id="lessonClose" aria-label="Close lesson">Back to dashboard</button>
            </div>
            <nav class="lesson-stepper" aria-label="Lesson steps">${tabs}</nav>
            <section class="lesson-stage">${stageContent}</section>
        `;
        content.querySelectorAll("[data-stage]").forEach(button => {
            button.addEventListener("click", () => renderLesson(result, button.dataset.stage));
        });
        content.querySelector("#lessonClose")?.addEventListener("click", closeLesson);
        content.querySelector("[data-close-lesson]")?.addEventListener("click", closeLesson);
        content.querySelector("#markConceptReviewed")?.addEventListener("click", async event => {
            event.currentTarget.disabled = true;
            try {
                await api(`/learning/${lesson.day}/concept`, { method: "POST", body: JSON.stringify({ reviewed: true }) });
                renderLesson(await api(`/learning/${lesson.day}`), "algorithm");
            } catch (error) {
                event.currentTarget.disabled = false;
                setLessonError(error.message);
            }
        });
        content.querySelector("#showActivityHint")?.addEventListener("click", event => {
            const hint = content.querySelector("#activityHint");
            hint.hidden = !hint.hidden;
            event.currentTarget.setAttribute("aria-expanded", String(!hint.hidden));
            event.currentTarget.textContent = hint.hidden ? "Show hint" : "Hide hint";
        });
        content.querySelector("#submitActivity")?.addEventListener("click", async event => {
            const button = event.currentTarget;
            const answer = content.querySelector("#activityAnswer").value.trim();
            if (!answer) return setLessonError("Enter the result of the activity test case first.");
            button.disabled = true;
            try {
                await api(`/learning/${lesson.day}/activity`, { method: "POST", body: JSON.stringify({ answer }) });
                activityFeedback = "Correct. The test result has been saved; the daily quiz is now available.";
                const updated = await api(`/learning/${lesson.day}`);
                renderLesson(updated, "practice");
            } catch (error) {
                button.disabled = false;
                content.querySelector("#activityFeedback").textContent = error.message;
                content.querySelector("#activityFeedback").classList.add("lesson-error");
            }
        });
        content.querySelectorAll("[data-hint]").forEach(button => {
            button.addEventListener("click", () => {
                const hint = content.querySelector(`[data-hint-content="${button.dataset.hint}"]`);
                hint.hidden = !hint.hidden;
                button.setAttribute("aria-expanded", String(!hint.hidden));
                button.textContent = hint.hidden ? "Show hint" : "Hide hint";
            });
        });
        content.querySelectorAll('#lessonQuiz input[type="radio"]').forEach(input => {
            input.addEventListener("change", () => {
                selectedAnswers[input.name] = Number(input.value);
                const count = Object.keys(selectedAnswers).length;
                content.querySelector("#quizProgress").textContent = `${count} of ${lesson.quiz.length} answered · ${lesson.quiz.length - count} remaining`;
                content.querySelector('#lessonQuiz button[type="submit"]').disabled = count !== lesson.quiz.length || !activityDone || quizDone;
            });
        });
        const quizProgress = content.querySelector("#quizProgress");
        if (quizProgress) quizProgress.textContent = `${Object.keys(selectedAnswers).length} of ${lesson.quiz.length} answered · ${lesson.quiz.length - Object.keys(selectedAnswers).length} remaining`;
        content.querySelector("#lessonQuiz")?.addEventListener("submit", async event => {
            event.preventDefault();
            if (Object.keys(selectedAnswers).length !== lesson.quiz.length) return setLessonError("Answer all 10 questions before submitting.");
            const button = content.querySelector('#lessonQuiz button[type="submit"]');
            button.disabled = true;
            button.textContent = "Submitting…";
            try {
                dailyFeedback = await api(`/learning/${lesson.day}/quiz`, { method: "POST", body: JSON.stringify({ answers: selectedAnswers }) });
                const dashboard = await api("/dashboard");
                renderDashboard(dashboard);
                const updated = await api(`/learning/${lesson.day}`);
                renderLesson(updated, dailyFeedback.passed ? "review" : "quiz");
            } catch (error) {
                button.disabled = false;
                button.textContent = "Submit daily quiz";
                setLessonError(error.message);
            }
        });
        content.querySelector("#startAssessment")?.addEventListener("click", () => openAssessment(assessmentId, lesson.day));
        content.querySelector("#nextLearningDay")?.addEventListener("click", () => openLesson(lesson.day + 1));
    }

    function renderFeedback(result) {
        const feedback = result.feedback.map((item, index) => `
            <p><strong>${item.correct ? "Correct" : "Review"}:</strong> ${escapeHtml(item.explanation)}
            ${item.correct ? "" : `<br>Correct answer: ${escapeHtml(item.expectedAnswer)}`}</p>
        `).join("");
        return `<div class="lesson-result" data-passed="${Boolean(result.passed)}"><strong>${result.passed ? "Passed" : "Not passed"} · ${result.score}%</strong><p>${escapeHtml(result.message)}</p>${feedback}</div>`;
    }

    async function openAssessment(assessmentId, day) {
        const content = root.querySelector("#lessonContent");
        content.innerHTML = '<p class="learn-empty">Loading milestone assessment…</p>';
        try {
            const assessment = await api(`/assessments/${encodeURIComponent(assessmentId)}`);
            content.innerHTML = `
                <div class="lesson-header"><div><span class="section-label">SEPARATE MILESTONE ASSESSMENT · 10 QUESTIONS</span><h2>${escapeHtml(assessment.title)}</h2></div>
                <button type="button" class="lesson-close" id="assessmentBack">Back to lesson</button></div>
                <p class="quiz-progress" id="assessmentProgress" aria-live="polite">0 of 10 answered · 10 remaining</p>
                <form id="assessmentQuiz">
                    ${assessment.questions.map((question, index) => `
                        <fieldset class="lesson-quiz-question"><legend>${index + 1}. ${escapeHtml(question.prompt)}</legend>
                            ${question.options.map((option, optionIndex) => `<label><input type="radio" name="${question.id}" value="${optionIndex}"> <span>${escapeHtml(option)}</span></label>`).join("")}
                            <button type="button" class="learn-small-button" data-assessment-hint="${question.id}">Show hint</button>
                            <p class="learn-hint" data-assessment-hint-content="${question.id}" hidden>${escapeHtml(question.hint)}</p>
                        </fieldset>`).join("")}
                    <button class="learn-action-button" type="submit">Submit assessment</button>
                </form><div id="assessmentResult"></div>
            `;
            content.querySelector("#assessmentBack").addEventListener("click", () => openLesson(day).then(() => renderLesson(activeLesson, "review")));
            content.querySelectorAll("[data-assessment-hint]").forEach(button => button.addEventListener("click", () => {
                const hint = content.querySelector(`[data-assessment-hint-content="${button.dataset.assessmentHint}"]`);
                hint.hidden = !hint.hidden;
                button.setAttribute("aria-expanded", String(!hint.hidden));
                button.textContent = hint.hidden ? "Show hint" : "Hide hint";
            }));
            content.querySelectorAll('#assessmentQuiz input[type="radio"]').forEach(input => input.addEventListener("change", () => {
                selectedAssessmentAnswers[input.name] = Number(input.value);
                const count = Object.keys(selectedAssessmentAnswers).length;
                content.querySelector("#assessmentProgress").textContent = `${count} of 10 answered · ${10 - count} remaining`;
                content.querySelector('#assessmentQuiz button[type="submit"]').disabled = count !== 10;
            }));
            const submitButton = content.querySelector('#assessmentQuiz button[type="submit"]');
            submitButton.disabled = Object.keys(selectedAssessmentAnswers).length !== 10;
            content.querySelector("#assessmentQuiz").addEventListener("submit", async event => {
                event.preventDefault();
                submitButton.disabled = true;
                try {
                    assessmentFeedback = await api(`/assessments/${encodeURIComponent(assessmentId)}/quiz`, {
                        method: "POST",
                        body: JSON.stringify({ answers: selectedAssessmentAnswers }),
                    });
                    const dashboard = await api("/dashboard");
                    renderDashboard(dashboard);
                    const updated = await api(`/learning/${day}`);
                    renderLesson(updated, assessmentFeedback.passed ? "review" : "review");
                } catch (error) {
                    submitButton.disabled = false;
                    content.querySelector("#assessmentResult").textContent = error.message;
                }
            });
        } catch (error) {
            content.innerHTML = `<p class="lesson-error" role="alert">${escapeHtml(error.message)}</p><button type="button" class="lesson-close" id="assessmentBack">Back to lesson</button>`;
            content.querySelector("#assessmentBack").addEventListener("click", () => openLesson(day));
        }
    }

    loadDashboard();
}
