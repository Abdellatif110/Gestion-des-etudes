StudyFlow - Study Management Application

student.png


A comprehensive study management and productivity platform


React-18.3-blue.svg


TypeScript-5.8-blue.svg


Vite-5.4-purple.svg


Tailwind-3.4-38bdf8.svg


Overview :

StudyFlow is a full-featured study management application designed to help students and lifelong learners organize their academic life, maintain focus during study sessions, and track their progress over time. The application combines multiple productivity tools into a cohesive, user-friendly interface that works entirely in the browser with no backend required.

The name "StudyFlow" reflects the application's philosophy of helping users enter and maintain a productive flow state while studying. By integrating time management techniques, task organization, and learning tools, StudyFlow provides everything students need to study more effectively and achieve better academic results.

Features
Focus Timer
The heart of StudyFlow is a sophisticated Pomodoro-style timer that helps users manage their study sessions effectively. The timer supports three distinct modes: work sessions for focused study, short breaks for quick rest periods, and long breaks for extended recovery after multiple work sessions. Users can customize the duration of each mode according to their preferences and workflow.

Pre-configured timer presets are available for different study scenarios. The Classic Pomodoro preset follows the traditional 25-minute work, 5-minute short break, and 15-minute long break schedule. Deep Focus extends work sessions to 50 minutes for longer concentration periods. Quick Sprint provides 15-minute work sessions for quick review sessions. Extended Session offers 45-minute blocks, while Study Marathon supports 60-minute intensive study periods.

The timer integrates with the task system, allowing users to associate their focus time with specific tasks they want to accomplish. This integration helps track how much time is spent on each subject or assignment, providing valuable insights into study patterns.

Task Management
StudyFlow's task management system provides comprehensive tools for organizing academic responsibilities. Users can create tasks with detailed descriptions, set priority levels (low, medium, or high), assign categories for organization, and set due dates to stay on top of deadlines. Each task can track the estimated and actual number of pomodoro sessions required to complete it.

Subtasks allow breaking down complex assignments into smaller, manageable steps. The task list supports filtering by status (all, active, completed) and sorting by priority, date created, or estimated pomodoro count. Visual progress indicators show completion percentage, and completed tasks are clearly distinguished from active ones with visual feedback.

The task system automatically persists all data to local storage, ensuring that study plans are never lost. Whether users close the browser or return days later, their tasks remain exactly as they left them, ready to continue working.

Notes
The notes feature provides a quick and intuitive way to capture ideas, study materials, and important information. Notes support rich text content with automatic formatting preservation, color coding for visual organization, and full-text search to quickly find previously created notes.

Creating a new note is as simple as clicking the "New Note" button and typing. Notes can be edited at any time, and the application tracks both creation and modification dates. The search functionality filters notes in real-time as users type, making it easy to locate specific information even when the note collection grows large.

Notes are displayed in a responsive grid layout that adapts to different screen sizes. Each note shows a preview of its content, allowing users to quickly identify the note they need without opening it. The color-coded system helps users visually categorize notes by subject, urgency, or any other system that works for their study habits.

Flashcards
The flashcards system supports spaced repetition learning through customizable decks of study cards. Users can create themed decks for different subjects, add cards with questions on the front and answers on the back, and track their mastery progress for each card.

Creating a deck is straightforward: users name the deck, optionally add a description, and choose a color for visual identification. Within each deck, cards can be added with front (question) and back (answer) content. The study mode presents cards one at a time with a smooth flip animation, allowing users to recall the answer before revealing it.

After revealing the answer, users mark each review as correct or incorrect. The application tracks correct and incorrect counts for each card, helping identify which material has been mastered and which needs more review. This data-driven approach to flashcard study helps optimize learning efficiency by focusing attention on challenging material.

Goals
StudyFlow's goal-setting feature helps users establish and track academic objectives. Users can create goals based on study time (in minutes) or number of completed sessions, with optional deadlines to maintain accountability. The goals dashboard shows progress toward each objective with visual progress bars and percentage completion indicators.

Goals can be created for daily study habits, weekly reading targets, or longer-term academic milestones. The system automatically updates progress as users complete study sessions and tasks, providing continuous feedback on advancement toward objectives. Completed goals are marked with visual celebration, reinforcing positive study habits.

Statistics
The statistics dashboard provides comprehensive insights into study habits and productivity patterns. Users can view total focus time accumulated across all sessions, number of sessions completed, tasks finished, and current study streaks. The weekly overview chart visualizes productivity trends over the past seven days.

Achievement badges gamify the study experience by recognizing milestones such as completing the first session, reaching ten sessions, achieving fifty sessions, and mastering ten tasks. These achievements provide motivational feedback and encourage consistent study habits.

The statistics system also tracks average sessions per day and total pomodoros completed, offering multiple perspectives on productivity performance. All statistics are calculated in real-time from the study data stored locally, ensuring accurate and up-to-date information.

AI Assistant
The AI Assistant page provides a conversational interface for study-related queries and assistance. Users can ask questions about study techniques, subject matter clarification, time management strategies, or any other academic topic. The chat interface maintains conversation history, allowing users to reference previous exchanges.

This feature demonstrates how the application can be extended with artificial intelligence capabilities to provide personalized study support. The assistant can help explain difficult concepts, suggest study strategies, provide motivation, and answer questions that arise during study sessions.

Settings
The settings page allows users to customize their StudyFlow experience. Timer settings control default durations for work sessions, short breaks, and long breaks, as well as the number of sessions before a long break is triggered. Auto-start options can automatically begin breaks or work sessions when the timer completes, streamlining the workflow for users who prefer uninterrupted focus.

Sound notifications can be enabled or disabled according to preference. The settings persist across sessions, ensuring that user preferences are remembered each time they return to the application.

Technology Stack
StudyFlow is built with modern web technologies that ensure performance, type safety, and maintainability:

Frontend Framework: React 18 with functional components and hooks provides a responsive, component-based user interface. React's ecosystem and community support ensure long-term viability and easy extensibility.

Language: TypeScript adds static type checking to JavaScript, catching errors during development and providing better code documentation through type annotations. This results in more reliable code with fewer runtime bugs.

Build Tool: Vite provides extremely fast development server startup and hot module replacement, significantly improving the development experience. The production build uses Rollup under the hood for optimized output.

Styling: Tailwind CSS enables utility-first styling that is highly customizable and produces minimal CSS bundles. The glassmorphism design elements, gradients, and smooth animations create a modern, visually appealing interface.

UI Components: shadcn/ui provides accessible, customizable components built on Radix UI primitives. These components offer a consistent design language while remaining fully customizable through Tailwind CSS.

State Management: Zustand with persistence middleware manages application state with a simple, hook-based API. The persist middleware automatically saves all state to localStorage and restores it on page reload, providing a seamless user experience without requiring a backend.

Routing: React Router handles client-side navigation between different application pages, enabling a single-page application architecture with fast, transitions between views.

Data Visualization: Recharts provides responsive, animated charts for the statistics dashboard, making it easy to visualize productivity trends and progress over time.

Forms: React Hook Form with Zod validation provides performant form handling with robust client-side validation.

Icons: Lucide React offers a comprehensive library of consistent, well-designed icons used throughout the application interface.

Installation and Setup
Prerequisites
Before installing StudyFlow, ensure you have the following tools installed on your system:

Node.js version 18 or higher (recommended: LTS version)
npm, yarn, or bun package manager (the project includes a bun.lockb lockfile)
Installation Steps
Follow these steps to set up StudyFlow on your local machine:

1.
Clone or Extract the Project
If you have the project files extracted or cloned to your local machine, navigate to the project directory:
bash
cd Gestion-des-etude-main
2.
Install Dependencies
Using npm:
bash
npm install
Using yarn:
bash
yarn install
Using bun:
bash
bun install
3.
Start the Development Server
bash
npm run dev
The development server will start, typically at http://localhost:5173. Open this URL in your web browser to access the application.
4.
Build for Production
To create a production-optimized build:
bash
npm run build
The built files will be in the dist directory, ready for deployment to any static hosting service.
5.
Preview Production Build
To preview the production build locally:
bash
npm run preview
Project Structure
Gestion-des-etude-main/
├── public/                 # Static assets (images, favicon, etc.)
├── src/
│   ├── components/
│   │   ├── layout/        # Layout components (Sidebar, Layout)
│   │   ├── tasks/         # Task-related components
│   │   ├── timer/         # Timer-related components
│   │   └── ui/            # Reusable UI components (shadcn/ui)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components (routes)
│   ├── store/             # Zustand state management
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and Tailwind
├── package.json           # Project dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
Usage Guide
Getting Started with the Focus Timer
The Focus Timer is the primary feature of StudyFlow. To begin your first study session:

1.
Navigate to the home page (Focus Timer)
2.
Choose a timer preset that matches your study needs, or customize durations in Settings
3.
Optionally, select a task from the dropdown to associate this session with
4.
Click the play button to start the timer
5.
Focus on your work until the timer completes
6.
Take your break when prompted, then start the next work session
Managing Tasks
To create your first task:

1.
Navigate to the Tasks page
2.
Click the "Add Task" button
3.
Enter a task title and optional description
4.
Set the priority level and estimated pomodoros
5.
Optionally add subtasks and set a due date
6.
Click "Create Task" to save
As you complete pomodoros on associated tasks, update the completion count to track your progress.

Creating Flashcard Decks
To build your first flashcard deck:

1.
Navigate to the Flashcards page
2.
Click "New Deck"
3.
Enter a deck name and optional description
4.
Choose a color for visual identification
5.
Click "Create Deck"
6.
Add cards with questions and answers
7.
Start studying by clicking "Study Now"
Taking Notes
To capture your first note:

1.
Navigate to the Notes page
2.
Click "New Note"
3.
Enter a title and your note content
4.
Choose a color for visual organization
5.
Click "Create Note" to save
Use the search bar to quickly find notes by title or content.

Setting Goals
To establish your study goals:

1.
Navigate to the Goals page
2.
Click "Add Goal"
3.
Enter a goal title and target (minutes or sessions)
4.
Optionally set a deadline
5.
Click "Create Goal" to save
Progress is automatically tracked as you complete study sessions and tasks.

Data Persistence
StudyFlow stores all data locally in your browser's localStorage under the key studyflow-storage. This means:

Your data persists across browser sessions and page refreshes
No account or login is required
Data remains on your device and is not transmitted to external servers
Clearing browser data will remove your stored information
To backup your data, you can use browser developer tools to inspect localStorage, or implement a future export feature. To reset all data, clear the application storage through browser settings.

Customization
Theme Colors
The application's color scheme can be customized by modifying the Tailwind CSS configuration. The default theme uses a professional blue-green palette optimized for extended use during study sessions.

Timer Durations
Default timer durations and other preferences can be modified through the Settings page or directly in the source code for development customization.

Adding New Features
StudyFlow's modular architecture makes it easy to extend:

1.
New pages can be added to the src/pages/ directory
2.
Components should be placed in src/components/ following existing patterns
3.
State can be added to the Zustand store in src/store/studyStore.ts
4.
New routes should be added in src/App.tsx
Browser Compatibility
StudyFlow is designed to work on all modern web browsers:

Chrome (recommended for best performance)
Firefox
Safari
Edge
Internet Explorer is not supported due to modern JavaScript features used throughout the application.

Contributing
This project was generated using the Lovable AI-assisted development platform. For contributions:

1.
Fork the repository
2.
Create a feature branch for your changes
3.
Make your modifications following existing code patterns
4.
Test thoroughly before submitting
5.
Submit a pull request for review
License
This project is open source and available for personal and educational use.#
