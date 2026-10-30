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
| **1. Requirements Analysis & Feasibility Study** | - Define the catalog, learning curriculum, account, and progress requirements.<br>- Select the browser, Express, SQLite, and Wandbox integration stack. | - Project setup instructions and implemented catalog/curriculum scope. |
| **2. Architectural & Detailed System Design** | - SQLite schema and API design.<br>- Frontend visualization and animation behavior.<br>- JWT authentication and account-scoped data access. | - Architecture, data-flow, ER, activity, component, object, and use-case diagrams included in this documentation. |
| **3. Iterative Implementation** | - Algorithm catalog and explanation pages.<br>- Sorting, searching, tree, and graph visualizers.<br>- Browser-based Practice Lab, Express API, SQLite persistence, and 30-day curriculum. | - Vite frontend, Express API, database-backed catalog and learning content. |
| **4. Verification & Quality Assurance** | - Node.js automated tests for catalog complexity metadata, content migration, API reads, authentication, and learning progression.<br>- JavaScript syntax checks and Vite production build. | - Automated test suite and build checks. Manual browser/device and live Wandbox checks were not run in this review. |
| **5. Packaging & Local Startup** | - Vite production build configuration.<br>- Runtime settings (`JWT_SECRET`, `FRONTEND_ORIGINS`, `DB_PATH`, `PORT`).<br>- Windows startup script. | - Local startup instructions and launcher script; the project is not deployed as a public service. |
| **6. Future Maintenance** | - Potential improvements include broader browser testing and deployment hardening. | - Future work; no production deployment is claimed. |

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

    User -->|Browse, visualize, register, learn| System
    System -->|Pages, animation, lesson results| User
    System <-->|Authenticated /api requests| Storage
    User -->|Practice Lab browser POST: code, language, stdin| Compiler
    Compiler -->|JSON compile result| User
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

    User -->|Source code, language & stdin| P4[4.0 Practice Lab in Browser]
    P4 -->|Direct HTTPS POST to Wandbox| Compiler
    Compiler -->|JSON stdout, stderr & status| P4
    P4 -->|Execution output| User

    User -->|Start Day / Progress Concept| P5[5.0 30-Day Learning Path]
    P5 <-->|Read / Write Status & Unlocks| D2

    User -->|Submit Activity Output| P6[6.0 Activity Validator]
    P6 -->|Check against Server Test Case| P6
    P6 -->|Record Activity Record| D4
    P6 -->|Unlock Quiz Stage| D2

    User -->|Submit 10-Question Answers| P7[7.0 Quiz & Assessment Grader]
    P7 -->|Compute Score & Passing Criteria| P7
    P7 -->|Record Attempt Score| D3
    P7 -->|Update Daily/Milestone Passed Status| D2
    P7 -->|Result Feedback & Explanations| User

    User -->|Load dashboard| P8[8.0 Dashboard & Notifications]
    P8 <-->|Read / Persist Notifications| D6
    P8 -->|Dashboard and notifications| User
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
        P5_3[5.3 Save completion & unlock next day]
        P8[8.0 Generate dashboard notifications]
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

    P7_1 & P7_2 -->|Check passing gates| P5_3
    P5_3 -->|Set completedAt = NOW| DB_LP
    P5_3 -->|Unlock Day N+1| Student
    Student -->|Load dashboard| P8
    P8 -->|Persist notification records| DB_NT
    P8 -->|Return notifications| Student
```

---

### 3.7.2 Entity Relationship Diagram (ERD)

The runtime content and user-data schema is implemented in SQLite with foreign key enforcement and cascading deletion. On startup, backend seed sources are validated and transactionally upserted; API reads use the database tables.

```mermaid
erDiagram
    USERS ||--o{ LEARNING_PROGRESS : tracks
    USERS ||--o{ QUIZ_ATTEMPTS : submits
    USERS ||--o{ ACTIVITY_ATTEMPTS : records
    USERS ||--o{ ASSESSMENT_ATTEMPTS : undertakes
    USERS ||--o{ NOTIFICATIONS : receives
    LESSONS ||--o{ QUIZZES : contains
    QUIZZES ||--o{ QUIZ_QUESTIONS : contains

    ALGORITHMS {
        TEXT slug PK "Unique Algorithm Slug"
        TEXT categoryKey "Catalog Category Key"
        TEXT categoryLabel "Catalog Category Label"
        INTEGER position "Order Within Category"
        TEXT name "Algorithm Name"
        TEXT description "Card Description"
        TEXT timeComplexity "Time Complexity"
        TEXT auxiliarySpace "Auxiliary Space"
    }

    LESSONS {
        INTEGER day PK "Day Number 1 to 30"
        TEXT title "Lesson Title"
        TEXT level "Difficulty Level"
        INTEGER minutes "Estimated Minutes"
        TEXT objectivesJson "Lesson Objectives"
        TEXT explanation "Lesson Explanation"
        TEXT exampleJson "Example Input and Output"
        TEXT steps "Guided Steps"
        TEXT activity "Practical Activity"
        TEXT activityInput "Activity Input"
        TEXT activityHint "Activity Hint"
        TEXT activityExpectedAnswer "Server-side Expected Result"
        TEXT linksJson "Lesson Resource Links"
    }

    QUIZZES {
        TEXT id PK "Daily Quiz or Assessment ID"
        TEXT type "daily or assessment"
        INTEGER day FK "Lesson or Milestone Day"
        TEXT title "Quiz Title"
        TEXT daysJson "Days Covered by Assessment"
    }

    QUIZ_QUESTIONS {
        TEXT quizId PK, FK "References QUIZZES(id)"
        TEXT id PK "Question ID"
        INTEGER position "Question Order"
        TEXT prompt "Question Text"
        TEXT optionsJson "Answer Choices"
        INTEGER answerIndex "Server-side Correct Option"
        TEXT hint "Question Hint"
        TEXT explanation "Answer Explanation"
    }

    USERS {
        TEXT id PK "UUID / Unique User ID"
        TEXT name "Full Student Name"
        TEXT email UK "Unique Email; no verification workflow"
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
        TEXT assessmentId "Assessment identifier"
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
        Answer10MCQs --> GradeQuiz : POST /api/learning/{day}/quiz
        
        state CheckQuizGrade <<choice>>
        GradeQuiz --> CheckQuizGrade
        CheckQuizGrade --> Stage5_Quiz : Score < 70% (Failed - Retry with Hints)
        CheckQuizGrade --> CheckMilestoneDay : Score >= 70% (Passed)
        
        state CheckMilestoneDay <<choice>>
        CheckMilestoneDay --> Stage6_Review : Standard Day (Not 7, 14, 21, 30)
        CheckMilestoneDay --> MilestoneAssessment : Day is 7, 14, 21, or 30
        
        MilestoneAssessment --> Take10AssessmentQuestions : 10 Authored Milestone Questions
        Take10AssessmentQuestions --> GradeAssessment : POST /api/assessments/{assessmentId}/quiz
        
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

### 3.7.4 Component Diagram

The implementation uses a multi-page browser frontend, one Express server module, and a SQLite database; the backend does not contain separate controller classes.

```mermaid
flowchart LR
    Student[Student Browser]
    subgraph Frontend[HTML, CSS and JavaScript]
        Pages[Application Pages]
        Dashboard[learning-dashboard.js]
        Catalog[Algorithm Catalog Client]
        Practice[practice-app.js]
    end
    subgraph Backend[Node.js Backend]
        API[backend/server.js Express API]
        Content[backend/content-store.js]
    end
    Sources["data/*.js; backend/curriculum.js; backend/quiz-bank.js"]
    Database[(SQLite database)]
    Wandbox[Wandbox Compile API]

    Student --> Pages
    Pages --> Dashboard
    Pages --> Catalog
    Dashboard -->|Authenticated /api requests| API
    Catalog -->|Catalog API requests| API
    API --> Content
    Content --> Database
    API --> Database
    Sources -->|Startup seed and validation| Content
    Practice -->|Direct HTTPS compile request| Wandbox
    Wandbox -->|Compile response| Practice
```

---

### 3.7.5 Object Diagram

This diagram is an illustrative sample of persisted application data, not a capture of a real student account or runtime session.

```mermaid
classDiagram
    %% Fictional sample data
    class sampleUser {
        id = "sample-user-01"
        name = "Alex Example"
        email = "alex@example.test"
        createdAt = "2026-01-15T09:30:00Z"
    }

    class day1Progress {
        userId = "sample-user-01"
        day = 1
        startedAt = "2026-01-15T09:35:10Z"
        conceptCompletedAt = "2026-01-15T09:50:22Z"
        activityCompletedAt = "2026-01-15T10:12:40Z"
        dailyQuizPassed = 1
        latestScore = 90.0
        completedAt = "2026-01-15T10:25:00Z"
    }

    class day2Progress {
        userId = "sample-user-01"
        day = 2
        startedAt = "2026-01-15T10:25:05Z"
        conceptCompletedAt = null
        activityCompletedAt = null
        dailyQuizPassed = 0
        latestScore = 0.0
        completedAt = null
    }

    class activityAttempt_act99 {
        id = "sample-activity-01"
        userId = "sample-user-01"
        day = 1
        answer = "3"
        accepted = 1
        submittedAt = "2026-01-15T10:12:40Z"
    }

    class quizAttempt_qz312 {
        id = "sample-quiz-01"
        userId = "sample-user-01"
        day = 1
        score = 90.0
        passed = 1
        submittedAt = "2026-01-15T10:24:55Z"
    }

    class notification_notif01 {
        id = "sample-notification-01"
        notificationKey = "sample-notification-key-01"
        userId = "sample-user-01"
        day = 1
        message = "Sample notification: Day 1 completed."
        createdAt = "2026-01-15T10:26:00Z"
        readAt = null
    }

    sampleUser --> day1Progress : tracks
    sampleUser --> day2Progress : tracks
    day1Progress --> activityAttempt_act99 : verified by
    day1Progress --> quizAttempt_qz312 : cleared by
    sampleUser --> notification_notif01 : receives
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
| **3.7.1 DFD (0, 1, 2)** | Yourdon & Coad / Gane & Sarson | Traces data inputs, processes, data stores, and outputs across levels; Practice Lab calls Wandbox directly from the browser. |
| **3.7.2 ERD** | Crow's Foot Relational Notation | Represents SQLite tables, PK/FK relationships, and cascade actions. |
| **3.7.3 Activity Diagram** | UML 2.5 Activity / State Machine | Maps user decision diamonds, stage gating, and milestone checks. |
| **3.7.4 Component Diagram** | Component / data-flow view | Shows the implemented browser, Express API, content store, SQLite, and direct Wandbox connection. |
| **3.7.5 Object Diagram** | UML 2.5 Instance Snapshot | Shows fictional sample account and Day 1 records; it is not actual runtime data. |
| **3.7.6 Use Case Diagram** | UML 2.5 Use Case Specification | Illustrates user actors, system boundaries, includes, and extends. |
