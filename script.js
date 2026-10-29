/* =====================================================
   ALGORITHM HUB
   JAVASCRIPT
===================================================== */


/* =====================================================
   SHARED HELPERS
===================================================== */
function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getAuthValue(key) {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
}

function clearAuthStorage() {
    for (const storage of [localStorage, sessionStorage]) {
        storage.removeItem("algorithmHubToken");
        storage.removeItem("algorithmHubUser");
        storage.removeItem("algorithmHubDemoMode");
    }
}

/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {

    navLinks.classList.toggle("show");

    const icon = menuBtn.querySelector("i");

    if (navLinks.classList.contains("show")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }

});


/* Close mobile menu when clicking a link */

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("show");

        const icon = menuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* =====================================================
   DARK / LIGHT THEME
===================================================== */

const themeBtn = document.getElementById("themeBtn");

themeBtn?.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("light-theme")) {

        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

    } else {

        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

    }

});

/* =====================================================
   CONDITIONAL NAVIGATION & AUTH STATE SYNC
   - Guest: Displays only Home, Algorithms, About (Explanation, Visualizer, Practice hidden)
   - Signed in: Displays ALL pages (Home, Algorithms, Explanation, Visualizer, Practice, About)
===================================================== */

const PROTECTED_PAGES = ["explanation.html", "visualizer.html", "practice.html"];

export function checkIsLoggedIn() {
    const savedToken = getAuthValue("algorithmHubToken");
    const savedAccount = getAuthValue("algorithmHubUser");
    if (!savedToken || !savedAccount) return false;
    try {
        const account = JSON.parse(savedAccount);
        return Boolean(account && (account.email || account.name));
    } catch {
        return false;
    }
}

export function syncAuthNavigation() {
    const isLoggedIn = checkIsLoggedIn();
    let account = null;
    try {
        account = JSON.parse(getAuthValue("algorithmHubUser") || "null");
    } catch {
        account = null;
    }

    document.body.classList.toggle("user-logged-in", isLoggedIn);
    document.body.classList.toggle("user-guest", !isLoggedIn);

    // 1. Control visibility of navigation tabs
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        const href = (link.getAttribute("href") || "").toLowerCase();
        const isProtected = PROTECTED_PAGES.some(page => href.includes(page)) || link.dataset.auth === "required";

        if (isProtected) {
            if (isLoggedIn) {
                link.classList.remove("nav-tab-hidden");
                link.style.display = "";
            } else {
                link.classList.add("nav-tab-hidden");
                link.style.display = "none";
            }
        } else {
            link.classList.remove("nav-tab-hidden");
            link.style.display = "";
        }
    });

    // 2. Control nav actions / Sign In vs Dashboard & Sign Out
    const navActions = document.querySelector(".nav-actions");
    if (navActions) {
        let accountBtn = navActions.querySelector(".nav-button");
        if (!accountBtn) {
            accountBtn = document.createElement("a");
            accountBtn.className = "nav-button";
            accountBtn.id = "navAccountLink";
            const menuBtn = navActions.querySelector(".menu-btn");
            navActions.insertBefore(accountBtn, menuBtn || null);
        }

        let existingSignOut = document.getElementById("navSignOutBtn")
            || document.getElementById("signOutButton");

        if (isLoggedIn) {
            accountBtn.href = "profile.html";
            const displayName = account?.name ? account.name.split(" ")[0] : "Dashboard";
            accountBtn.innerHTML = '<i class="fa-solid fa-user-check" aria-hidden="true"></i> ';
            accountBtn.append(document.createTextNode(displayName));
            accountBtn.title = "View Account Dashboard";

            if (!existingSignOut) {
                const signOutBtn = document.createElement("button");
                signOutBtn.className = "nav-signout-btn";
                signOutBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i>';
                const menuBtn = navActions.querySelector(".menu-btn");
                navActions.insertBefore(signOutBtn, menuBtn || null);
                existingSignOut = signOutBtn;
            }

            existingSignOut.id = "navSignOutBtn";
            existingSignOut.title = "Sign Out";
            existingSignOut.setAttribute("aria-label", "Sign Out");
            if (existingSignOut.dataset.logoutBound !== "true") {
                existingSignOut.dataset.logoutBound = "true";
                existingSignOut.addEventListener("click", async () => {
                    const token = getAuthValue("algorithmHubToken");
                    try {
                        if (token) {
                            const response = await fetch("/api/logout", {
                                method: "POST",
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            if (!response.ok) throw new Error("The server could not confirm the sign-out.");
                        }
                    } catch (error) {
                        console.error("Server-side sign-out failed:", error);
                        window.alert("The server could not confirm sign-out. This browser will forget the token, but sign out again after reconnecting to revoke the server session.");
                    } finally {
                        clearAuthStorage();
                        window.location.href = "index.html";
                    }
                });
            }
        } else {
            accountBtn.href = "signin.html";
            accountBtn.innerHTML = 'Sign In';
            accountBtn.title = "Sign In to access all pages";

            if (existingSignOut) {
                existingSignOut.remove();
            }
        }
    }

    // 3. Guard protected pages from unauthorized direct access
    const currentPath = window.location.pathname.toLowerCase().split("/").pop() || "";
    const isCurrentPageProtected = PROTECTED_PAGES.some(page => currentPath.includes(page));

    if (isCurrentPageProtected && !isLoggedIn) {
        renderAuthGateModal(currentPath);
    }
}

function renderAuthGateModal(pageName) {
    if (document.getElementById("authGateModal")) return;

    let friendlyName = "This Feature";
    if (pageName.includes("explanation")) friendlyName = "Interactive Explanation Library";
    else if (pageName.includes("visualizer")) friendlyName = "Interactive Algorithm Visualizer";
    else if (pageName.includes("practice")) friendlyName = "Hands-On Coding Practice Arena";

    const modal = document.createElement("div");
    modal.id = "authGateModal";
    modal.className = "auth-gate-backdrop";
    modal.innerHTML = `
        <div class="auth-gate-card">
            <div class="auth-gate-icon-wrap">
                <i class="fa-solid fa-lock"></i>
            </div>
            <span class="auth-gate-chip">MEMBER ACCESS ONLY</span>
            <h2>Sign In Required</h2>
            <p>
                <strong>${friendlyName}</strong> is reserved for registered Algorithm Hub members. Sign in now to unlock full interactive step-by-step traces, live visualizers, and code practice arenas.
            </p>
            <div class="auth-gate-actions">
                <a href="signin.html?redirect=${encodeURIComponent(pageName)}" class="auth-gate-signin-btn">
                    <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In to Unlock
                </a>
                <a href="index.html" class="auth-gate-home-btn">
                    <i class="fa-solid fa-house"></i> Return to Home
                </a>
                <a href="algorithms.html" class="auth-gate-home-btn">
                    <i class="fa-solid fa-book-open"></i> Browse Public Algorithm Catalog
                </a>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Run auth navigation sync immediately & on DOM load
syncAuthNavigation();
document.addEventListener("DOMContentLoaded", syncAuthNavigation);

/* =====================================================
   MEMBER DASHBOARD (profile.html) CONTROLLERS
===================================================== */

function initProfileDashboard() {
    const profileDashboard = document.getElementById("profileDashboard");
    if (!profileDashboard) return;

    const savedAccount = getAuthValue("algorithmHubUser");
    const savedToken = getAuthValue("algorithmHubToken");
    let account;
    try {
        account = JSON.parse(savedAccount || "null");
    } catch {
        account = null;
    }

    if (!savedToken || !account?.email) {
        window.location.replace("signin.html?redirect=profile.html");
        return;
    }

    // 1. Identity & Profile Display
    const displayName = account.name || account.email.split("@")[0];
    const firstName = displayName.trim().split(/\s+/)[0];
    const initials = displayName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase();

    const greetingEl = document.getElementById("profileGreeting");
    const nameEl = document.getElementById("profileName");
    const emailEl = document.getElementById("profileEmail");
    const initialsEl = document.getElementById("profileInitials");

    if (greetingEl) greetingEl.textContent = `Welcome back, ${firstName}`;
    if (nameEl) nameEl.textContent = displayName;
    if (emailEl) emailEl.textContent = account.email;
    if (initialsEl) initialsEl.textContent = initials;

    // 2. Streaks, XP and Level stats
    let currentStreak = parseInt(localStorage.getItem("algoHubStreak") || "0", 10);
    let currentXP = parseInt(localStorage.getItem("algoHubXP") || "0", 10);

    const dashStreakValue = document.getElementById("dashStreakValue");
    const dashXpValue = document.getElementById("dashXpValue");
    const dashLevelTitle = document.getElementById("dashLevelTitle");
    const dashCheckInBtn = document.getElementById("dashCheckInBtn");
    const dashCheckInMsg = document.getElementById("dashCheckInMsg");

    function renderDashboardMetrics() {
        if (dashStreakValue) dashStreakValue.textContent = `${currentStreak} Days`;
        if (dashXpValue) dashXpValue.textContent = `${currentXP.toLocaleString()} XP`;
        if (dashLevelTitle) {
            const level = Math.floor(currentXP / 200);
            dashLevelTitle.textContent = `Level ${level} Scholar`;
        }
    }
    renderDashboardMetrics();

    const todayKey = getLocalDateKey();
    const lastCheckIn = localStorage.getItem("algoHubLastCheckIn");
    if (lastCheckIn === todayKey && dashCheckInBtn) {
        dashCheckInBtn.disabled = true;
        dashCheckInBtn.innerHTML = '<i class="fa-solid fa-check"></i> Checked In Today!';
        if (dashCheckInMsg) dashCheckInMsg.textContent = "You have already checked in today.";
    }

    dashCheckInBtn?.addEventListener("click", () => {
        if (localStorage.getItem("algoHubLastCheckIn") === todayKey) return;
        const yesterday = getLocalDateKey(new Date(Date.now() - 86400000));
        currentStreak = lastCheckIn === yesterday ? currentStreak + 1 : 1;
        currentXP += 50;
        localStorage.setItem("algoHubStreak", currentStreak);
        localStorage.setItem("algoHubXP", currentXP);
        localStorage.setItem("algoHubLastCheckIn", todayKey);
        renderDashboardMetrics();

        dashCheckInBtn.disabled = true;
        dashCheckInBtn.innerHTML = '<i class="fa-solid fa-check"></i> Checked In Today!';
        if (dashCheckInMsg) {
            dashCheckInMsg.textContent = `Checked in successfully! +50 XP claimed. Streak: ${currentStreak} day(s).`;
        }
    });

    // 3. Interactive Algorithm Mastery Checklist
    let masteredAlgos = [];
    try {
        masteredAlgos = JSON.parse(localStorage.getItem("algoHubMastered") || '[]');
    } catch {
        masteredAlgos = [];
    }

    const dashSolvedCount = document.getElementById("dashSolvedCount");
    const dashAlgoCards = document.querySelectorAll(".dash-algo-card");

    function updateMasteryCards() {
        dashAlgoCards.forEach(card => {
            const algoId = card.dataset.id;
            const isMastered = masteredAlgos.includes(algoId);
            const btn = card.querySelector(".dash-master-btn");

            if (isMastered) {
                card.classList.add("is-mastered");
                card.dataset.status = "mastered";
                if (btn) btn.innerHTML = '<i class="fa-solid fa-check"></i> Mastered';
            } else {
                card.classList.remove("is-mastered");
                card.dataset.status = "progress";
                if (btn) btn.innerHTML = '<i class="fa-regular fa-circle"></i> In Progress';
            }
        });

        if (dashSolvedCount) {
            dashSolvedCount.textContent = `${masteredAlgos.length} / 93`;
        }
    }
    updateMasteryCards();

    // Toggle master button clicks
    document.querySelectorAll(".dash-master-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const algoId = btn.dataset.id;
            if (masteredAlgos.includes(algoId)) {
                masteredAlgos = masteredAlgos.filter(id => id !== algoId);
            } else {
                masteredAlgos.push(algoId);
            }
            localStorage.setItem("algoHubMastered", JSON.stringify(masteredAlgos));
            updateMasteryCards();
        });
    });

    // Filter tabs
    const filterTabs = document.querySelectorAll(".dash-filter-btn");
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            const filter = tab.dataset.filter;

            dashAlgoCards.forEach(card => {
                if (filter === "all") {
                    card.style.display = "flex";
                } else if (filter === "mastered") {
                    card.style.display = card.dataset.status === "mastered" ? "flex" : "none";
                } else if (filter === "progress") {
                    card.style.display = card.dataset.status === "progress" ? "flex" : "none";
                }
            });
        });
    });

    // 4. Interactive Dashboard Sandbox Simulator
    const dashAlgoSelect = document.getElementById("dashAlgoSelect");
    const dashRunSandboxBtn = document.getElementById("dashRunSandboxBtn");
    const dashSimConsole = document.getElementById("dashSimConsole");

    dashRunSandboxBtn?.addEventListener("click", () => {
        const algo = dashAlgoSelect ? dashAlgoSelect.value : "binary-search";
        if (!dashSimConsole) return;

        dashSimConsole.innerHTML = '<span class="log-highlight"><i class="fa-solid fa-spinner fa-spin"></i> Initializing simulation environment...</span>';

        setTimeout(() => {
            if (algo === "binary-search") {
                dashSimConsole.innerHTML = `
                    <div class="log-highlight">&gt; Initializing Binary Search on arr = [2, 5, 8, 12, 16, 23, 38, 56], Target = 23</div>
                    <div>&gt; [Step 1] low=0, high=7, mid=3 (val=12). 12 &lt; 23 -&gt; Eliminate left half. low=4.</div>
                    <div>&gt; [Step 2] low=4, high=7, mid=5 (val=23). 23 == 23 -&gt; Target found!</div>
                    <div class="log-success">&gt; [Result] Element 23 located at index 5 in 2 comparisons! (O(log n) efficiency verified ✓)</div>
                `;
            } else if (algo === "bubble-sort") {
                dashSimConsole.innerHTML = `
                    <div class="log-highlight">&gt; Initializing Bubble Sort on arr = [64, 34, 25, 12, 22, 11, 90]</div>
                    <div>&gt; [Pass 1] Swapping adjacent elements. (64 &gt; 34), (64 &gt; 25), (64 &gt; 12)... Max 90 floated to end.</div>
                    <div>&gt; [Pass 2] 6 comparisons, 4 swaps performed.</div>
                    <div>&gt; [Pass 3] Array stabilized and sorted.</div>
                    <div class="log-success">&gt; [Result] Sorted array: [11, 12, 22, 25, 34, 64, 90] in 7.2ms ✓</div>
                `;
            } else if (algo === "two-pointers") {
                dashSimConsole.innerHTML = `
                    <div class="log-highlight">&gt; Initializing Two Pointers on sorted arr = [1, 3, 5, 9, 11], Target Sum = 14</div>
                    <div>&gt; [Step 1] left=0 (1), right=4 (11). Sum = 12. Sum &lt; 14 -&gt; left++</div>
                    <div>&gt; [Step 2] left=1 (3), right=4 (11). Sum = 14. 14 == 14 -&gt; MATCH!</div>
                    <div class="log-success">&gt; [Result] Pair found at indices [1, 4] (3 + 11 = 14) in O(n) single pass ✓</div>
                `;
            }
        }, 350);
    });
}

initProfileDashboard();
document.addEventListener("DOMContentLoaded", initProfileDashboard);



/* =====================================================
   CATEGORY FILTER
===================================================== */

const categoryButtons = document.querySelectorAll(".category-btn");
const algorithmCards = document.querySelectorAll(".algorithm-card");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const selectedCategory = button.dataset.category;

        algorithmCards.forEach(card => {

            const cardCategory = card.dataset.category;

            if (
                selectedCategory === "all" ||
                selectedCategory === cardCategory
            ) {

                card.style.display = "block";

                setTimeout(() => {
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, 50);

            } else {

                card.style.opacity = "0";
                card.style.transform = "translateY(10px)";

                setTimeout(() => {
                    card.style.display = "none";
                }, 250);

            }

        });

    });

});


/* =====================================================
   COUNTER ANIMATION
===================================================== */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const increment = Math.max(1, Math.ceil(target / 50));

            const updateCounter = () => {

                current += increment;

                if (current >= target) {

                    counter.textContent = target;

                } else {

                    counter.textContent = current;

                    requestAnimationFrame(updateCounter);

                }

            };

            updateCounter();

            counterObserver.unobserve(counter);

        });

    },

    {
        threshold: 0.5
    }

);

counters.forEach(counter => {
    counterObserver.observe(counter);
});


/* =====================================================
   VISUALIZER DEMO
===================================================== */

const playBtn = document.getElementById("playBtn");

const bars = document.querySelectorAll(".bar");

const comparisonCount = document.getElementById(
    "comparisonCount"
);

const swapCount = document.getElementById(
    "swapCount"
);


let visualizing = false;


playBtn?.addEventListener("click", () => {

    if (visualizing) {
        return;
    }

    visualizing = true;

    playBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Running...';

    let comparisons = 0;
    let swaps = 0;

    bars.forEach((bar, index) => {

        setTimeout(() => {

            bar.style.transform =
                "translateY(-15px) scale(1.08)";

            bar.style.filter =
                "brightness(1.4)";

            comparisons += 4;

            comparisonCount.textContent =
                comparisons;

            if (index % 2 === 0) {

                swaps++;

                swapCount.textContent =
                    String(swaps).padStart(2, "0");

            }

        }, index * 300);

        setTimeout(() => {

            bar.style.transform = "";
            bar.style.filter = "";

        }, index * 300 + 450);

    });


    setTimeout(() => {

        visualizing = false;

        playBtn.innerHTML =
            '<i class="fa-solid fa-play"></i> Visualize';

    }, bars.length * 300 + 700);

});


/* =====================================================
   ACTIVE NAVIGATION
===================================================== */

const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }

    });


    navItems.forEach(item => {

        item.classList.remove("active");

        if (
            item.getAttribute("href") ===
            "#" + currentSection
        ) {

            item.classList.add("active");

        }

    });

});


/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements = document.querySelectorAll(
    ".algorithm-card, .feature-box, .road-step"
);

revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
        "opacity .7s ease, transform .7s ease";

});


const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {
                return;
            }

            entry.target.style.opacity = "1";
            entry.target.style.transform =
                "translateY(0)";

            revealObserver.unobserve(entry.target);

        });

    },

    {
        threshold: 0.15
    }

);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =====================================================
   AUTH / SIGN IN FLOW
===================================================== */

async function sendAuthRequest(endpoint, payload) {
    let response;
    try {
        response = await fetch(`/api/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } catch {
        throw new Error("Cannot reach the server. Start the backend with `npm run dev --prefix backend` and try again.");
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || "The request could not be completed.");
    }
    return data;
}

const signinForm = document.getElementById("signinForm");
const signupForm = document.getElementById("signupForm");

if (signinForm) {
    const emailInput = signinForm.querySelector('input[name="email"]');
    const passwordInput = signinForm.querySelector('input[name="password"]');
    const rememberInput = signinForm.querySelector('input[name="remember"]');
    const forgotPasswordLink = document.getElementById("forgotPasswordLink");
    const status = document.getElementById("signinStatus");
    const submitBtn = signinForm.querySelector('button[type="submit"]');

    forgotPasswordLink?.addEventListener("click", (event) => {
        event.preventDefault();
        status.textContent = "Password reset is not available because this project has no configured email service. Contact the project administrator.";
        status.classList.add("error");
        status.classList.remove("success");
    });

    signinForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            status.textContent = "Please enter both email and password.";
            status.classList.add("error");
            status.classList.remove("success");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const requestedTarget = urlParams.get("redirect") || "profile.html";
        const allowedTargets = ["index.html", "algorithms.html", "explanation.html", "visualizer.html", "practice.html", "profile.html"];
        const redirectTarget = allowedTargets.includes(requestedTarget) ? requestedTarget : "profile.html";

        function proceedWithLogin(token, user) {
            clearAuthStorage();
            const storage = rememberInput.checked ? localStorage : sessionStorage;
            storage.setItem("algorithmHubToken", token);
            storage.setItem("algorithmHubUser", JSON.stringify(user));
            status.textContent = "Sign in successful. Unlocking all pages...";
            status.classList.add("success");
            status.classList.remove("error");
            submitBtn.disabled = true;
            setTimeout(() => {
                window.location.href = redirectTarget;
            }, 800);
        }

        try {
            status.textContent = "Signing in...";
            status.classList.remove("error", "success");
            submitBtn.disabled = true;

            const data = await sendAuthRequest("login", { email, password });
            proceedWithLogin(data.token, data.user);
        } catch (error) {
            submitBtn.disabled = false;
            status.classList.add("error");
            status.classList.remove("success");
            
            status.textContent = error.message || "Unable to sign in right now.";
            status.classList.add("error");
            status.classList.remove("success");
        }
    });

}

if (signupForm) {
    const nameInput = signupForm.querySelector('input[name="name"]');
    const emailInput = signupForm.querySelector('input[name="email"]');
    const passwordInput = signupForm.querySelector('input[name="password"]');
    const confirmPasswordInput = signupForm.querySelector('input[name="confirmPassword"]');
    const status = document.getElementById("signupStatus");
    const submitBtn = signupForm.querySelector('button[type="submit"]');

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!name || !email || !password || !confirmPassword) {
            status.textContent = "Please complete all fields.";
            status.classList.add("error");
            status.classList.remove("success");
            return;
        }

        if (password.length < 6) {
            status.textContent = "Password must be at least 6 characters long.";
            status.classList.add("error");
            status.classList.remove("success");
            return;
        }

        if (password !== confirmPassword) {
            status.textContent = "Passwords do not match.";
            status.classList.add("error");
            status.classList.remove("success");
            return;
        }

        try {
            status.textContent = "Creating account...";
            status.classList.remove("error", "success");
            submitBtn.disabled = true;

            const data = await sendAuthRequest("register", { name, email, password });

            status.textContent = "Account created successfully. Redirecting to sign in...";
            status.classList.add("success");

            setTimeout(() => {
                window.location.href = "signin.html";
            }, 1200);
        } catch (error) {
            status.textContent = error.message || "Unable to create account right now.";
            status.classList.add("error");
            status.classList.remove("success");
            submitBtn.disabled = false;
        }
    });
}

const toggleButtons = document.querySelectorAll(".toggle-password");

toggleButtons.forEach(button => {
    button.addEventListener("click", () => {
        const field = button.parentElement.querySelector("input");
        const isPassword = field.type === "password";
        field.type = isPassword ? "text" : "password";
        button.textContent = isPassword ? "Hide" : "Show";
    });
});


/* =====================================================
   INTERACTIVE EXTRA LEARNING SUITE CONTROLLERS
===================================================== */

function initLearningSuiteInteractivity() {
    // 1. Binary Search Interactive Trace
    const traceArrayDisplay = document.getElementById("traceArrayDisplay");
    const traceStepCounter = document.getElementById("traceStepCounter");
    const traceExplainText = document.getElementById("traceExplainText");
    const tracePrevBtn = document.getElementById("tracePrevBtn");
    const traceNextBtn = document.getElementById("traceNextBtn");
    const traceResetBtn = document.getElementById("traceResetBtn");

    if (traceArrayDisplay) {
        const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
        const steps = [
            {
                low: 0,
                high: 9,
                mid: 4,
                text: "Step 1: low=0, high=9. mid=4 (val=16). Since 16 < 23, search right half (low = mid + 1 = 5)."
            },
            {
                low: 5,
                high: 9,
                mid: 7,
                text: "Step 2: low=5, high=9. mid=7 (val=56). Since 56 > 23, search left half (high = mid - 1 = 6)."
            },
            {
                low: 5,
                high: 6,
                mid: 5,
                found: true,
                text: "Step 3: low=5, high=6. mid=5 (val=23). Target 23 MATCHED at index 5! Search Complete ✓"
            }
        ];
        let currentStep = 0;

        function renderTraceStep(stepIdx) {
            const step = steps[stepIdx];
            if (traceStepCounter) traceStepCounter.textContent = `Step ${stepIdx + 1} / ${steps.length}`;
            if (traceExplainText) traceExplainText.textContent = step.text;
            traceArrayDisplay.innerHTML = "";

            arr.forEach((val, idx) => {
                const cell = document.createElement("div");
                cell.className = "trace-cell";
                cell.textContent = val;

                if (idx >= step.low && idx <= step.high) {
                    cell.classList.add("in-range");
                }
                if (idx === step.mid) {
                    cell.classList.add(step.found ? "found-cell" : "mid-cell");
                    const tag = document.createElement("span");
                    tag.className = "pointer-tag";
                    tag.textContent = step.found ? "TARGET!" : "MID";
                    cell.appendChild(tag);
                } else if (idx === step.low && idx === step.high) {
                    const tag = document.createElement("span");
                    tag.className = "pointer-tag";
                    tag.textContent = "L=H";
                    cell.appendChild(tag);
                } else if (idx === step.low) {
                    const tag = document.createElement("span");
                    tag.className = "pointer-tag";
                    tag.textContent = "LOW";
                    cell.appendChild(tag);
                } else if (idx === step.high) {
                    const tag = document.createElement("span");
                    tag.className = "pointer-tag";
                    tag.textContent = "HIGH";
                    cell.appendChild(tag);
                }
                traceArrayDisplay.appendChild(cell);
            });
        }

        renderTraceStep(0);

        traceNextBtn?.addEventListener("click", () => {
            currentStep = (currentStep + 1) % steps.length;
            renderTraceStep(currentStep);
        });
        tracePrevBtn?.addEventListener("click", () => {
            currentStep = (currentStep - 1 + steps.length) % steps.length;
            renderTraceStep(currentStep);
        });
        traceResetBtn?.addEventListener("click", () => {
            currentStep = 0;
            renderTraceStep(currentStep);
        });
    }

    // 2. Interactive Complexity Benchmarks
    const benchSlider = document.getElementById("benchSlider");
    const benchNLabel = document.getElementById("benchNLabel");
    const countO1 = document.getElementById("countO1");
    const countOLogN = document.getElementById("countOLogN");
    const countON = document.getElementById("countON");
    const countON2 = document.getElementById("countON2");
    const barO1 = document.getElementById("barO1");
    const barOLogN = document.getElementById("barOLogN");
    const barON = document.getElementById("barON");
    const barON2 = document.getElementById("barON2");

    if (benchSlider) {
        const sizes = [10, 100, 1000, 10000];
        const updateBenchmarks = (valIndex) => {
            const n = sizes[valIndex];
            if (benchNLabel) benchNLabel.textContent = `N = ${n.toLocaleString()}`;
            if (countO1) countO1.textContent = "1 op";
            const logN = Math.ceil(Math.log2(n));
            if (countOLogN) countOLogN.textContent = `${logN} ops`;
            if (countON) countON.textContent = `${n.toLocaleString()} ops`;
            const n2 = n * n;
            if (countON2) countON2.textContent = n2 >= 1e6 ? `${(n2 / 1e6).toFixed(0)}M ops` : `${n2.toLocaleString()} ops`;

            if (barO1) barO1.style.width = "8%";
            if (barOLogN) barOLogN.style.width = `${Math.min(15 + logN * 2, 50)}%`;
            if (barON) barON.style.width = `${Math.min(30 + valIndex * 15, 80)}%`;
            if (barON2) barON2.style.width = "100%";
        };

        benchSlider.addEventListener("input", (e) => {
            updateBenchmarks(parseInt(e.target.value, 10));
        });
    }

    // 3. Multi-Language Code Switcher
    const polyTabs = document.querySelectorAll(".poly-tab");
    const polyCodeDisplay = document.getElementById("polyCodeDisplay");
    const polyCopyBtn = document.getElementById("polyCopyBtn");

    const codeSnippets = {
        python: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
        java: `public int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        cpp: `int binarySearch(const vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`,
        js: `function binarySearch(arr, target) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}`
    };

    polyTabs.forEach(btn => {
        btn.addEventListener("click", () => {
            polyTabs.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            const lang = btn.dataset.lang;
            if (polyCodeDisplay && codeSnippets[lang]) {
                polyCodeDisplay.textContent = codeSnippets[lang];
            }
        });
    });

    polyCopyBtn?.addEventListener("click", () => {
        if (polyCodeDisplay) {
            navigator.clipboard.writeText(polyCodeDisplay.textContent);
            polyCopyBtn.innerHTML = '<i class="fa-solid fa-check" style="color:var(--success)"></i>';
            setTimeout(() => {
                polyCopyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
            }, 1500);
        }
    });

    // 4. DSA Pattern Selector
    const patternTabs = document.querySelectorAll(".pattern-tab-btn");
    const patternTitle = document.getElementById("patternTitle");
    const patternFreq = document.getElementById("patternFreq");
    const patternDesc = document.getElementById("patternDesc");
    const patternProblems = document.getElementById("patternProblems");

    const patternDetails = {
        "two-pointers": {
            title: "Two Pointers Blueprint",
            freq: "🔥 96% Frequency",
            desc: "Iterate from both ends of a sorted array toward the center to find pairs, partition values, or eliminate brute force O(n²) scans.",
            problems: "3Sum, Container With Most Water, Trapping Rain Water, Valid Palindrome"
        },
        "sliding-window": {
            title: "Sliding Window Blueprint",
            freq: "🔥 92% Frequency",
            desc: "Maintain a dynamic sub-array window to find minimum/maximum subarray constraints with linear O(n) scan time.",
            problems: "Longest Substring Without Repeating, Minimum Window Substring, Max Subarray Sum"
        },
        "monotonic-stack": {
            title: "Monotonic Stack Blueprint",
            freq: "⚡ 88% Frequency",
            desc: "Maintain monotonic elements to find next greater/smaller elements in O(n) without nested loops.",
            problems: "Daily Temperatures, Largest Rectangle in Histogram, Next Greater Element"
        },
        "dp": {
            title: "Dynamic Programming Memo",
            freq: "🔥 94% Frequency",
            desc: "Break complex recursive problems into overlapping subproblems, caching intermediate solutions via 1D/2D arrays.",
            problems: "Climbing Stairs, Coin Change, Longest Common Subsequence, 0/1 Knapsack"
        }
    };

    patternTabs.forEach(btn => {
        btn.addEventListener("click", () => {
            patternTabs.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            const pat = btn.dataset.pattern;
            const data = patternDetails[pat];
            if (data && patternTitle) {
                patternTitle.textContent = data.title;
                patternFreq.textContent = data.freq;
                patternDesc.textContent = data.desc;
                patternProblems.textContent = data.problems;
            }
        });
    });

    // 5. Test Runner & Hints Engine
    const sandboxRunTestsBtn = document.getElementById("sandboxRunTestsBtn");
    const sandboxHintBtn = document.getElementById("sandboxHintBtn");
    const sandboxTestOutput = document.getElementById("sandboxTestOutput");
    const sandboxHintBox = document.getElementById("sandboxHintBox");
    const hintBtnText = document.getElementById("hintBtnText");
    const hintTitleText = document.getElementById("hintTitleText");
    const hintContentText = document.getElementById("hintContentText");

    const hints = [
        {
            num: 1,
            title: "Hint 1: Loop Boundaries",
            text: "Ensure your loop condition is low <= high instead of low < high so single-element boundaries are inspected."
        },
        {
            num: 2,
            title: "Hint 2: Integer Overflow",
            text: "Calculate mid = low + (high - low) / 2 rather than (low + high) / 2 to avoid integer overflow in languages with fixed int types."
        },
        {
            num: 3,
            title: "Hint 3: Optimal Complexity",
            text: "Binary search eliminates half the search space per iteration, achieving O(log n) time and O(1) space."
        }
    ];
    let currentHintIndex = 0;

    sandboxRunTestsBtn?.addEventListener("click", () => {
        const binarySearch = (values, target) => {
            let low = 0;
            let high = values.length - 1;
            while (low <= high) {
                const mid = low + Math.floor((high - low) / 2);
                if (values[mid] === target) return mid;
                if (values[mid] < target) low = mid + 1;
                else high = mid - 1;
            }
            return -1;
        };
        const tests = [
            { label: "Target present [2, 5, 8, 12, 16], target 12", actual: () => binarySearch([2, 5, 8, 12, 16], 12), expected: 3 },
            { label: "Target absent [2, 5, 8, 12, 16], target 9", actual: () => binarySearch([2, 5, 8, 12, 16], 9), expected: -1 },
            { label: "Single-element boundary [7], target 7", actual: () => binarySearch([7], 7), expected: 0 }
        ];
        sandboxRunTestsBtn.disabled = true;
        sandboxRunTestsBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Running...';
        const results = tests.map(test => {
            const started = performance.now();
            let actual;
            let error = null;
            try { actual = test.actual(); } catch (caught) { error = caught; }
            const passed = !error && actual === test.expected;
            return { ...test, passed, actual: error ? error.message : actual, elapsed: Math.max(0, performance.now() - started) };
        });
        if (sandboxTestOutput) {
            sandboxTestOutput.innerHTML = results.map((result, index) => `
                <div class="test-item-row ${result.passed ? "pass" : "fail"}">
                    <i class="fa-solid ${result.passed ? "fa-circle-check" : "fa-circle-xmark"}"></i>
                    <span>Test ${index + 1}: ${result.label} (expected ${result.expected}, got ${result.actual})</span>
                    <strong>${result.passed ? "Passed" : "Failed"} (${result.elapsed.toFixed(2)} ms)</strong>
                </div>`).join("") + `<p class="test-summary">${results.filter(result => result.passed).length} of ${results.length} binary-search checks passed.</p>`;
        }
        sandboxRunTestsBtn.disabled = false;
        sandboxRunTestsBtn.innerHTML = '<i class="fa-solid fa-play"></i> Run Demo Checks';
    });

    sandboxHintBtn?.addEventListener("click", () => {
        if (!sandboxHintBox) return;
        sandboxHintBox.style.display = "block";
        const hint = hints[currentHintIndex];
        if (hintTitleText) hintTitleText.textContent = hint.title;
        if (hintContentText) hintContentText.textContent = hint.text;
        currentHintIndex = (currentHintIndex + 1) % hints.length;
        if (hintBtnText) hintBtnText.textContent = `Next Hint (${currentHintIndex + 1}/${hints.length})`;
    });

    // 6. Streaks & Badges Check-In
    const streakCheckInBtn = document.getElementById("streakCheckInBtn");
    const streakCountDisplay = document.getElementById("streakCountDisplay");
    const streakStatusMsg = document.getElementById("streakStatusMsg");
    const nextBadgeItem = document.getElementById("nextBadgeItem");

    let savedStreak = parseInt(localStorage.getItem("algoHubStreak") || "0", 10);
    const checkInToday = getLocalDateKey();
    const previousCheckIn = localStorage.getItem("algoHubLastCheckIn");
    if (streakCountDisplay) streakCountDisplay.textContent = `${savedStreak} Days`;
    if (previousCheckIn === checkInToday && streakCheckInBtn) {
        streakCheckInBtn.disabled = true;
        streakCheckInBtn.innerHTML = '<i class="fa-solid fa-check"></i> Checked In Today!';
        if (streakStatusMsg) streakStatusMsg.textContent = "You have already checked in today.";
    }

    streakCheckInBtn?.addEventListener("click", () => {
        if (localStorage.getItem("algoHubLastCheckIn") === checkInToday) return;
        const yesterdayKey = getLocalDateKey(new Date(Date.now() - 86400000));
        savedStreak = previousCheckIn === yesterdayKey ? savedStreak + 1 : 1;
        const savedXP = parseInt(localStorage.getItem("algoHubXP") || "0", 10) + 50;
        localStorage.setItem("algoHubStreak", savedStreak);
        localStorage.setItem("algoHubXP", savedXP);
        localStorage.setItem("algoHubLastCheckIn", checkInToday);
        if (streakCountDisplay) streakCountDisplay.textContent = `${savedStreak} Days`;
        if (streakStatusMsg) streakStatusMsg.textContent = `Checked in! +50 XP claimed. Streak: ${savedStreak} day(s).`;
        if (nextBadgeItem) {
            nextBadgeItem.className = "badge-mini-item unlocked";
            nextBadgeItem.innerHTML = '<i class="fa-solid fa-bolt" style="color:var(--warning)"></i><span>DP Ace</span>';
        }
        streakCheckInBtn.disabled = true;
        streakCheckInBtn.innerHTML = '<i class="fa-solid fa-check"></i> Checked In Today!';
    });
}

// Initialize learning suite interactivity on load
initLearningSuiteInteractivity();
document.addEventListener("DOMContentLoaded", initLearningSuiteInteractivity);