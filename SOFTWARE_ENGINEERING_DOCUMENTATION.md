# Algorithm Hub — Software Engineering Documentation & Project Diagrams

---

## 3.6 Detailed Project Life Cycle (SDLC)

The development of **Algorithm Hub** follows the **Iterative and Incremental Agile Software Development Life Cycle (SDLC)** model. This methodology was chosen over the traditional Waterfall model due to the multi-faceted nature of the application—combining algorithmic visualization engines, real-time code compilation interfaces, and an authenticated sequential 30-day learning management system.

```mermaid
flowchart LR
    A[1. Requirement Analysis & Planning] --> B[2. System & Architectural Design]
    B --> C[3. Iterative Implementation]
    C --> D[4. Verification & Testing]
    D --> E[5. Deployment & Production Readiness]
    E --> F[6. Maintenance & Continuous Enhancement]
    F -. Feedback Loop .-> C
```

### Phase Breakdown

| Phase | Key Activities & Objectives | Algorithm Hub Deliverables |
| :--- | :--- | :--- |
| **1. Requirements Analysis & Feasibility Study** | - Identification of end-user pain points in computer science education.<br>- Elicitation of functional and non-functional requirements.<br>- Analysis of technical stack feasibility (Vite, Vanilla JS, Express, SQLite, Wandbox API). | - Software Requirement Specification (SRS).<br>- High-level curriculum syllabus (30 days, 6 stages per day).<br>- Algorithm catalog taxonomy (93 algorithms across 12 categories). |
| **2. Architectural & Detailed System Design** | - Database schema modeling (relational integrity, cascades, indexing).<br>- RESTful API specification and JWT security protocols.<br>- Visualizer Canvas/DOM rendering pipeline and animation state machines. | - System Architecture & Component Diagrams.<br>- Data Flow Diagrams (DFD Level 0, 1, 2).<br>- Entity Relationship Diagram (ERD).<br>- Detailed UML Class and Sequence specifications. |
| **3. Iterative Implementation (Sprints)** | - **Sprint 1**: Core Algorithm catalog (93 entries) & Markdown explanation rendering.<br>- **Sprint 2**: Interactive visualizers (Sorting, Searching, Trees, Graphs).<br>- **Sprint 3**: Practice Lab & multi-language online compiler integration.<br>- **Sprint 4**: Express backend, SQLite persistence, JWT authentication, and 30-day roadmap engine.<br>- **Sprint 5**: Comprehensive 300-question quiz bank and milestone assessments. | - Vite frontend modular bundle.<br>- REST API micro-service backend.<br>- Seeded curriculum and quiz banks (`curriculum.js`, `quiz-bank.js`). |
| **4. Verification & Quality Assurance (Testing)** | - Automated unit and integration testing via Node.js test runner.<br>- Curriculum integrity audits (checking question bank IDs, hints, explanations).<br>- Security auditing (bcrypt hashing, JWT revocation list, CORS validation).<br>- Cross-browser smoke testing and responsive viewport validation (375px to 4K). | - Node.js integration test suite (`npm test`).<br>- Catalog complexity validation report.<br>- Verified token lifecycle and isolation tests. |
| **5. Packaging & Deployment** | - Frontend optimization via Vite production build (`npm run build`).<br>- Environment configuration (`JWT_SECRET`, `FRONTEND_ORIGINS`, `DB_PATH`).<br>- Automated one-click execution scripting (`START-ALGORITHM-HUB.bat`). | - Optimized `dist/` bundle.<br>- Automated execution scripts for local and network testing. |
| **6. Maintenance & Evolution** | - Defect tracking and complexity edge-case resolution.<br>- Expansion of structured algorithmic complexity analysis.<br>- Scalability improvements for cloud hosting (e.g., PostgreSQL migration, Docker containerization). | - Ongoing version patches, audit logs, and maintenance roadmap. |

---

## 3.7 Software Engineering Diagrams

---

### 3.7.1 Data Flow Diagrams (DFD)

#### 1. DFD Level 0 (Context Diagram)
The Context Diagram establishes the boundary of the Algorithm Hub application, highlighting interactions between external entities (Student/User, External Wandbox Compiler API) and the central system.

```mermaid
flowchart TD
    User([Student / Learner])
    Compiler([Wandbox Remote Compiler API])
    System[[0.0 Algorithm Hub Integrated Learning Platform]]
    Storage[(SQLite Database \n algorithm-hub.db)]

    User -->|1. Sign Up / Sign In Credentials| System
    User -->|2. Algorithm Search & Visualizer Controls| System
    User -->|3. Code Snippet, Language & Input| System
    User -->|4. Activity Output & Quiz Answers| System

    System -->|5. Auth Token & Session State| User
    System -->|6. Step-by-Step Visualization Frames| User
    System -->|7. Execution Output & Compiler Status| User
    System -->|8. Daily Unlock State, Scores & Notifications| User

    System -->|HTTP POST: Source Code & Compiler Args| Compiler
    Compiler -->|JSON: Execution Result, Stdout, Stderr| System

    System <-->|CRUD: Users, Progress, Attempts, Revoked Tokens| Storage
```

---

#### 2. DFD Level 1 (Subsystem Deconstruction)
Level 1 decomposes the central system into its major functional modules and displays the internal data stores.

```mermaid
flowchart TD
    User([Student / Learner])
    Compiler([Wandbox Remote Compiler API])

    D1[(D1: Users Store)]
    D2[(D2: Learning Progress Store)]
    D3[(D3: Quiz & Assessment Attempts)]
    D4[(D4: Activity Attempts)]
    D5[(D5: Revoked Tokens)]
    D6[(D6: Notifications)]
    D7[(D7: Algorithm Knowledge Base)]

    User -->|Credentials| P1[1.0 Authentication & Session Controller]
    P1 -->|Store User / Verify Hash| D1
    P1 -->|Check / Invalidate Token| D5
    P1 -->|Issue JWT Token| User

    User -->|Query / Select Category| P2[2.0 Algorithm Catalog & Explanation Engine]
    P2 <-->|Fetch Content & Complexities| D7
    P2 -->|Formatted Explanation & Code| User

    User -->|Speed, Array Size, Step Controls| P3[3.0 Interactive Visualizer Engine]
    P3 -->|Render DOM/SVG State Transitions| User

    User -->|Source Code & Lang| P4[4.0 Practice Lab & Compiler Relay]
    P4 -->|Payload| Compiler
    Compiler -->|StdOut / Errors| P4
    P4 -->|Execution Console Output| User

    User -->|Start Day / Progress Concept| P5[5.0 30-Day Learning Path Controller]
    P5 <-->|Read / Write Status & Unlocks| D2
    P5 -->|Generate Reminders| D6
    D6 -->|Persistent Alerts| User

    User -->|Submit Activity Output| P6[6.0 Activity Validator]
    P6 -->|Check against Server Test Case| P6
    P6 -->|Record Activity Record| D4
    P6 -->|Unlock Quiz Stage| D2

    User -->|Submit 10-Question Answers| P7[7.0 Quiz & Assessment Grader]
    P7 -->|Compute Score & Passing Criteria| P7
    P7 -->|Record Attempt Score| D3
    P7 -->|Update Daily/Milestone Passed Status| D2
    P7 -->|Result Feedback & Explanations| User
```

---

#### 3. DFD Level 2 (Curriculum & Evaluation Pipeline)
Focuses specifically on the progression engine (Processes 5.0, 6.0, and 7.0).

```mermaid
flowchart TD
    Student([Student])
    
    subgraph Curriculum_Subsystem [Curriculum & Verification Pipeline]
        P5_1[5.1 Verify Day Prerequisites]
        P5_2[5.2 Track 6-Stage Progress]
        P6_1[6.1 Validate Activity Output]
        P7_1[7.1 Grade Daily Quiz]
        P7_2[7.2 Evaluate Milestone Assessment]
        P5_3[5.3 Unlock Next Day & Issue Alert]
    end

    DB_LP[(learning_progress)]
    DB_AA[(activity_attempts)]
    DB_QA[(quiz_attempts)]
    DB_ASM[(assessment_attempts)]
    DB_NT[(notifications)]

    Student -->|Request Day N| P5_1
    P5_1 <-->|Read Day N-1 Status| DB_LP
    P5_1 -->|Granted Day Access| P5_2

    Student -->|Concept Done| P5_2
    P5_2 -->|Update conceptCompletedAt| DB_LP

    Student -->|Submit Activity Result| P6_1
    P6_1 -->|Compare with Test Case| P6_1
    P6_1 -->|Insert Result| DB_AA
    P6_1 -->|Update activityCompletedAt| DB_LP

    Student -->|Submit 10 Daily Answers| P7_1
    P7_1 -->|Check Answer Keys & Tally Score| P7_1
    P7_1 -->|Log Attempt| DB_QA
    P7_1 -->|If Score >= 70%: Set dailyQuizPassed=1| DB_LP

    Student -->|If Milestone Day: Submit Assessment| P7_2
    P7_2 -->|Grade Assessment Answers| P7_2
    P7_2 -->|Log Assessment Attempt| DB_ASM

    P7_1 & P7_2 -->|Check Passing Gates| P5_3
    P5_3 -->|Set completedAt = NOW| DB_LP
    P5_3 -->|Create Success Notification| DB_NT
    P5_3 -->|Unlock Day N+1| Student
```

---

### 3.7.2 Entity Relationship Diagram (ERD)

The relational schema is implemented in SQLite with foreign key enforcement and cascading deletion.

```mermaid
erDiagram
    USERS ||--o{ LEARNING_PROGRESS : tracks
    USERS ||--o{ QUIZ_ATTEMPTS : submits
    USERS ||--o{ ACTIVITY_ATTEMPTS : records
    USERS ||--o{ ASSESSMENT_ATTEMPTS : undertakes
    USERS ||--o{ NOTIFICATIONS : receives

    USERS {
        TEXT id PK "UUID / Unique User ID"
        TEXT name "Full Student Name"
        TEXT email UK "Unique Email Address"
        TEXT password "Bcrypt Hashed Password"
        TEXT createdAt "ISO-8601 Timestamp"
    }

    LEARNING_PROGRESS {
        TEXT userId PK, FK "References USERS(id)"
        INTEGER day PK "Day Number 1 to 30"
        TEXT startedAt "Lesson Start Timestamp"
        TEXT conceptCompletedAt "Concept Stage Timestamp"
        TEXT activityCompletedAt "Activity Verified Timestamp"
        INTEGER dailyQuizPassed "0 or 1 Passing Flag"
        REAL latestScore "Most Recent Score Percentage"
        TEXT completedAt "Final Day Completion Timestamp"
    }

    QUIZ_ATTEMPTS {
        TEXT id PK "UUID Attempt ID"
        TEXT userId FK "References USERS(id)"
        INTEGER day "Day 1 to 30"
        REAL score "Score Percentage (0-100)"
        INTEGER passed "1 = Pass (>=70%), 0 = Fail"
        TEXT submittedAt "Submission Timestamp"
    }

    ACTIVITY_ATTEMPTS {
        TEXT id PK "UUID Attempt ID"
        TEXT userId FK "References USERS(id)"
        INTEGER day "Day 1 to 30"
        TEXT answer "Submitted Expected Result"
        INTEGER accepted "1 = Accepted, 0 = Rejected"
        TEXT submittedAt "Submission Timestamp"
    }

    ASSESSMENT_ATTEMPTS {
        TEXT id PK "UUID Assessment Attempt ID"
        TEXT userId FK "References USERS(id)"
        TEXT assessmentId "e.g. week-1, week-2, week-3, final-capstone"
        REAL score "Score Percentage (0-100)"
        INTEGER passed "1 = Pass (>=70%), 0 = Fail"
        TEXT submittedAt "Submission Timestamp"
    }

    NOTIFICATIONS {
        TEXT id PK "UUID Notification ID"
        TEXT notificationKey UK "Unique Composite Key"
        TEXT userId FK "References USERS(id)"
        INTEGER day "Relevant Day 1 to 30"
        TEXT message "Alert/Notification Content"
        TEXT createdAt "Generation Timestamp"
        TEXT readAt "Read Timestamp / Null"
    }

    REVOKED_TOKENS {
        TEXT tokenHash PK "SHA-256 Hash of JWT Token"
        TEXT expiresAt "JWT Expiration Timestamp"
    }
```

---

### 3.7.3 Activity Diagram

This diagram maps the learner journey across the Algorithm Hub platform, illustrating authentication, visual exploration, practice, and the strict sequential requirements of the 30-day curriculum.

```mermaid
stateDiagram-v2
    [*] --> LandingPage : Open http://localhost:3000
    LandingPage --> ExploreCatalog : View 93 Algorithms & Explanations
    LandingPage --> InteractiveVisualizer : Test Sorting / Graphs / Trees
    LandingPage --> PracticeLab : Write & Run Code (Wandbox API)
    LandingPage --> AuthenticationCheck : Access Student Dashboard

    state AuthenticationCheck <<choice>>
    AuthenticationCheck --> SignIn_SignUp : Not Authenticated
    AuthenticationCheck --> Dashboard : Valid JWT Token Present

    SignIn_SignUp --> RegisterUser : Submit New Account Form
    RegisterUser --> PasswordHash : Hash password with bcrypt
    PasswordHash --> IssueJWT : Store in SQLite & Generate JWT

    SignIn_SignUp --> VerifyLogin : Submit Login Credentials
    VerifyLogin --> CheckRevocation : Verify SHA-256 against revoked_tokens
    CheckRevocation --> IssueJWT : Credentials & Token Valid
    IssueJWT --> Dashboard : Load Student Profile & Analytics

    state Dashboard {
        [*] --> SelectCurrentDay : Fetch progress for Days 1-30
        SelectCurrentDay --> Stage1_Learn : Stage 1 (Concept Reading)
        Stage1_Learn --> Stage2_Understand : Stage 2 (Pseudocode & Complexity)
        Stage2_Understand --> Stage3_Visualize : Stage 3 (Interactive Step-Through)
        Stage3_Visualize --> Stage4_Practice : Stage 4 (Hands-on Challenge)
        
        Stage4_Practice --> SubmitActivityOutput : Enter Generated Result
        state CheckActivity <<choice>>
        SubmitActivityOutput --> CheckActivity
        CheckActivity --> Stage4_Practice : Incorrect Output (Try Again)
        CheckActivity --> Stage5_Quiz : Match with Authored Test Case
        
        Stage5_Quiz --> Answer10MCQs : Take 10-Question Daily Quiz
        Answer10MCQs --> GradeQuiz : POST /api/submit-quiz
        
        state CheckQuizGrade <<choice>>
        GradeQuiz --> CheckQuizGrade
        CheckQuizGrade --> Stage5_Quiz : Score < 70% (Failed - Retry with Hints)
        CheckQuizGrade --> CheckMilestoneDay : Score >= 70% (Passed)
        
        state CheckMilestoneDay <<choice>>
        CheckMilestoneDay --> Stage6_Review : Standard Day (Not 7, 14, 21, 30)
        CheckMilestoneDay --> MilestoneAssessment : Day is 7, 14, 21, or 30
        
        MilestoneAssessment --> Take10AssessmentQuestions : 10 Authored Milestone Questions
        Take10AssessmentQuestions --> GradeAssessment : POST /api/submit-assessment
        
        state CheckAssessmentGrade <<choice>>
        GradeAssessment --> CheckAssessmentGrade
        CheckAssessmentGrade --> MilestoneAssessment : Score < 70% (Review & Retake)
        CheckAssessmentGrade --> Stage6_Review : Score >= 70% (Milestone Cleared)
        
        Stage6_Review --> CompleteDay : Day Marked Complete
        CompleteDay --> UnlockNextDay : Unlock Day N+1 & Update Analytics
    }

    Dashboard --> Logout : Click Sign Out
    Logout --> RevokeSession : Hash token & save in revoked_tokens
    RevokeSession --> LandingPage : Redirect to Home
```

---

### 3.7.4 Class Diagram

The UML Class Diagram models both backend architectural controllers/services and frontend component modules.

```mermaid
classDiagram
    %% Backend Classes
    class ServerApp {
        -int PORT
        -string JWT_SECRET
        -sqlite3.Database db
        +initializeDb() void
        +setupRoutes() void
        +start() void
    }

    class AuthMiddleware {
        +requireAuth(req, res, next) void
        +createToken(user) string
        +verifyToken(token) object
        +revokeToken(token, expiresAt) void
    }

    class UserController {
        +register(req, res) void
        +login(req, res) void
        +logout(req, res) void
        +getMe(req, res) void
    }

    class CurriculumController {
        +getLearningProgress(req, res) void
        +startDay(req, res) void
        +completeConcept(req, res) void
        +submitActivity(req, res) void
        +getNotifications(req, res) void
        +markNotificationRead(req, res) void
    }

    class AssessmentController {
        +submitQuiz(req, res) void
        +submitAssessment(req, res) void
        -gradeAnswers(submitted, bank) GradeResult
    }

    class DatabaseService {
        -sqlite3.Database db
        +runDb(sql, params) Promise
        +getDb(sql, params) Promise
        +allDb(sql, params) Promise
    }

    %% Frontend Core Classes
    class VisualizerCore {
        -HTMLElement container
        -Array~int~ stateArray
        -int animationSpeed
        -boolean isRunning
        -boolean isPaused
        +setSpeed(speed) void
        +generateRandomArray(size) void
        +stepForward() void
        +stepBackward() void
        +play() void
        +pause() void
        +reset() void
    }

    class SortingVisualizer {
        +bubbleSort() void
        +selectionSort() void
        +insertionSort() void
        +mergeSort() void
        +quickSort() void
        -highlightBars(indices, color) void
        -swapBars(i, j) void
    }

    class GraphVisualizer {
        -Map nodes
        -Map edges
        +breadthFirstSearch(startNode) void
        +depthFirstSearch(startNode) void
        +dijkstra(startNode, endNode) void
        -highlightNode(nodeId, state) void
        -highlightEdge(u, v, state) void
    }

    class PracticeCompilerClient {
        -string wandboxApiEndpoint
        -string selectedLanguage
        -string sourceCode
        -string compilerOptions
        +setLanguage(lang) void
        +compileAndRun(code, stdin) Promise~ExecutionResult~
        +formatOutput(result) string
    }

    class LearningDashboardApp {
        -string authToken
        -object studentProfile
        -Array curriculumDays
        -int currentActiveDay
        +loadDashboardData() void
        +renderProgressBar() void
        +renderRadarChart() void
        +handleStageCompletion(day, stage) void
        +submitDailyQuiz(day, answers) void
        +submitMilestone(assessmentId, answers) void
    }

    %% Relationships
    ServerApp --> AuthMiddleware : uses
    ServerApp --> UserController : dispatches
    ServerApp --> CurriculumController : dispatches
    ServerApp --> AssessmentController : dispatches
    UserController --> DatabaseService : queries
    CurriculumController --> DatabaseService : queries
    AssessmentController --> DatabaseService : queries

    VisualizerCore <|-- SortingVisualizer : inherits
    VisualizerCore <|-- GraphVisualizer : inherits
    LearningDashboardApp ..> CurriculumController : consumes API
    LearningDashboardApp ..> AssessmentController : consumes API
    PracticeCompilerClient ..> VisualizerCore : complements
```

---

### 3.7.5 Object Diagram

This diagram displays a concrete runtime snapshot of system objects during an active student session on Day 1.

```mermaid
classDiagram
    %% Concrete Runtime Instances
    class currentUser_usr8491 {
        id = "usr-8491-b3f2"
        name = "Piyush Sharma"
        email = "piyush@example.com"
        createdAt = "2026-10-15T09:30:00Z"
    }

    class currentSession_jwt {
        tokenHash = "a7f49c0182bd..."
        expiresAt = "2026-11-05T09:30:00Z"
        isValid = true
    }

    class day1Progress {
        userId = "usr-8491-b3f2"
        day = 1
        startedAt = "2026-10-15T09:35:10Z"
        conceptCompletedAt = "2026-10-15T09:50:22Z"
        activityCompletedAt = "2026-10-15T10:12:40Z"
        dailyQuizPassed = 1
        latestScore = 90.0
        completedAt = "2026-10-15T10:25:00Z"
    }

    class day2Progress {
        userId = "usr-8491-b3f2"
        day = 2
        startedAt = "2026-10-15T10:25:05Z"
        conceptCompletedAt = null
        activityCompletedAt = null
        dailyQuizPassed = 0
        latestScore = 0.0
        completedAt = null
    }

    class activityAttempt_act99 {
        id = "act-9941"
        userId = "usr-8491-b3f2"
        day = 1
        answer = "3"
        accepted = 1
        submittedAt = "2026-10-15T10:12:40Z"
    }

    class quizAttempt_qz312 {
        id = "qa-3120"
        userId = "usr-8491-b3f2"
        day = 1
        score = 90.0
        passed = 1
        submittedAt = "2026-10-15T10:24:55Z"
    }

    class notification_notif01 {
        id = "notif-0182"
        notificationKey = "usr-8491-b3f2_day1_completed"
        userId = "usr-8491-b3f2"
        day = 1
        message = "Congratulations! You completed Day 1: Asymptotic Notation. Day 2 is unlocked."
        createdAt = "2026-10-15T10:25:00Z"
        readAt = null
    }

    class visualizerRuntimeInstance {
        currentAlgorithm = "Binary Search"
        dataset = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
        target = 23
        lowIndex = 4
        highIndex = 5
        midIndex = 5
        state = "ELEMENT_FOUND"
    }

    currentUser_usr8491 ..> currentSession_jwt : holds
    currentUser_usr8491 --> day1Progress : tracks
    currentUser_usr8491 --> day2Progress : tracks
    day1Progress --> activityAttempt_act99 : verified by
    day1Progress --> quizAttempt_qz312 : cleared by
    currentUser_usr8491 --> notification_notif01 : receives
    currentUser_usr8491 ..> visualizerRuntimeInstance : interacts with
```

---

### 3.7.6 Use Case Diagram

The Use Case Diagram defines the interactions between actors (Unregistered Visitor, Authenticated Student, Remote Compiler API) and the platform's core functional capabilities.

```mermaid
flowchart LR
    Visitor((Unregistered Visitor))
    Student((Authenticated Student))
    WandboxSystem((Wandbox API\nExternal System))

    subgraph Algorithm_Hub_Platform [Algorithm Hub Application Boundary]
        UC1[Browse 93 Algorithm Catalog]
        UC2[Read Algorithm Explanations & Complexity]
        UC3[Interact with Sorting & Graph Visualizers]
        UC4[Write Code in Practice Workspace]
        UC5[Execute & Compile Source Code]
        UC6[Register Student Account]
        UC7[Sign In / Authenticate]
        UC8[View 30-Day Learning Dashboard]
        UC9[Progress through 6-Stage Daily Lessons]
        UC10[Submit Hands-On Activity for Verification]
        UC11[Attempt 10-Question Daily Graded Quiz]
        UC12[Attempt Milestone Assessment Days 7,14,21,30]
        UC13[View Performance Radar & Score Analytics]
        UC14[Receive Notifications & Reminders]
        UC15[Logout & Invalidate Session Token]
    end

    %% Visitor Links
    Visitor --> UC1
    Visitor --> UC2
    Visitor --> UC3
    Visitor --> UC4
    Visitor --> UC6
    Visitor --> UC7

    %% Student Links
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC7
    Student --> UC8
    Student --> UC9
    Student --> UC10
    Student --> UC11
    Student --> UC12
    Student --> UC13
    Student --> UC14
    Student --> UC15

    %% Compiler Link
    UC4 -.->|<<include>>| UC5
    UC5 <--> WandboxSystem

    %% Curriculum Dependencies
    UC9 -.->|<<include>>| UC10
    UC9 -.->|<<include>>| UC11
    UC11 -.->|<<extend: if score >= 70%>>| UC8
    UC12 -.->|<<extend: triggered on milestone days>>| UC9
    UC8 -.->|<<include>>| UC13
    UC8 -.->|<<include>>| UC14
    UC7 -.->|<<include>>| UC8
```

---

## Summary of Diagram Types Provided

| Diagram Reference | Notation Standard | Primary Engineering Purpose |
| :--- | :--- | :--- |
| **3.6 SDLC** | Agile Flow Diagram | Details the 6-phase iterative development and QA methodology. |
| **3.7.1 DFD (0, 1, 2)** | Yourdon & Coad / Gane & Sarson | Traces data inputs, processes, data stores, and outputs across levels. |
| **3.7.2 ERD** | Crow's Foot Relational Notation | Represents SQLite tables, PK/FK relationships, and cascade actions. |
| **3.7.3 Activity Diagram** | UML 2.5 Activity / State Machine | Maps user decision diamonds, stage gating, and milestone checks. |
| **3.7.4 Class Diagram** | UML 2.5 Class Model | Defines modular object-oriented classes, controllers, and services. |
| **3.7.5 Object Diagram** | UML 2.5 Instance Snapshot | Shows actual runtime instances, token hashes, and Day 1 attempt data. |
| **3.7.6 Use Case Diagram** | UML 2.5 Use Case Specification | Illustrates user actors, system boundaries, includes, and extends. |
