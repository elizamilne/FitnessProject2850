<div align="center">

<img width="180" alt="Sila Fitness App Logo" src="https://github.com/user-attachments/assets/77b460e5-bf76-4deb-82b7-b73465e40864" />

### A modern fitness app for tracking workouts, progress, and personal goals.

<br />

![Status](https://img.shields.io/badge/status-completed-brightgreen)
![Platform](https://img.shields.io/badge/platform-web%20%7C%20mobile-blue)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## Table of Contents

- [Overview](#overview)
- [1. Getting Started](#1-getting-started)
  - [1.1. Running the Application Locally](#11-running-the-application-locally)
  - [1.2. Setup the Backend Application](#12-setup-the-backend-application)
  - [1.3. Setup the Frontend Application](#13-setup-the-frontend-application)
  - [1.4. Running the Application in GitHub Codespaces](#14-running-the-application-in-github-codespaces)
  - [1.5. Swagger UI / API Documentation](#15-swagger-ui--api-documentation)
  - [1.6. Testing](#16-testing)
- [2. Tech Stack](#2-tech-stack)
  - [2.1. Programming Languages](#21-programming-languages)
  - [2.2. Frameworks](#22-frameworks)
  - [2.3. Databases](#23-databases)
- [3. Project Architecture](#3-project-architecture)
  - [3.1. Frontend Structure](#31-frontend-structure)
  - [3.2. Frontend Features](#32-frontend-features)
  - [3.3. Shared Frontend Folders](#33-shared-frontend-folders)
  - [3.4. Backend Structure](#34-backend-structure)
  - [3.5. Backend Application Code](#35-backend-application-code)
  - [3.6. Backend Resources](#36-backend-resources)
  - [3.7. Backend Tests](#37-backend-tests)
  - [3.8. API Documentation and Testing Files](#38-api-documentation-and-testing-files)
  - [3.9. Development and IDE Files](#39-development-and-ide-files)

---

## Overview

**Sila** is a fitness tracking application that helps users plan workouts, record physical activities, and monitor their progress over time.

The app supports a wide range of exercise types, making it suitable for both casual users building healthier habits and individuals training for specific fitness goals or events.

---

## 1. Getting Started

The project can be run locally on your machine or inside GitHub Codespaces.

Before starting, make sure you have the following installed:

- Java, for running the Kotlin backend.
- Node.js and npm, for running the React frontend.
- Git, for cloning and managing the project.

Before executing any commands, ensure you are in the project’s root directory.

---

### 1.1. Running the Application Locally

When running the project locally, the backend runs on:

```bash
http://localhost:8080/
```

The frontend runs on:

```bash
http://localhost:5173/
```

The frontend sends API requests to the backend using the API URL defined in the frontend environment file.

Before starting the frontend, check the `.env` file inside the `frontend` folder:

```text
frontend/.env
```

For local development, the backend API URL should point to the local backend server:

```env
VITE_API_BASE_URL=http://localhost:8080
```

If your variable has a different name, keep the same variable name used in your project and only change the URL value.

---

### 1.2. Setup the Backend Application

From the root folder of the project, navigate to the backend directory:

```bash
cd backend
```

Build and start the backend server using the Gradle wrapper:

```bash
./gradlew run
```

The server will start on your local machine at:

```bash
http://localhost:8080/
```

Keep this terminal running while using the app.

---

### 1.3. Setup the Frontend Application

Open a new terminal from the root folder of the project, then navigate to the frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Start the frontend application:

```bash
npm run dev
```

The application will start locally.

Open in your browser:

```bash
http://localhost:5173/
```

---

### 1.4. Running the Application in GitHub Codespaces

When running the project in GitHub Codespaces, the frontend and backend are hosted on cloud URLs instead of `localhost`.

The backend still runs on port `8080`, but Codespaces exposes it using a forwarded port URL. The frontend must use this Codespaces backend URL so that Axios can send requests to the backend correctly.

#### Step 1: Start the backend

From the root folder:

```bash
cd backend
./gradlew run
```

After the backend starts, open the **Ports** tab in Codespaces and find port `8080`.

Copy the forwarded URL for port `8080`. It will look similar to this:

```text
https://your-codespace-name-8080.app.github.dev
```

#### Step 2: Update the frontend environment variable

Open the frontend environment file:

```text
frontend/.env
```

Change the API base URL variable so it points to the Codespaces backend URL:

```env
VITE_API_BASE_URL=https://your-codespace-name-8080.app.github.dev
```

Do not include a trailing slash at the end of the URL unless your Axios configuration specifically requires it.

#### Step 3: Start the frontend

Open a new terminal from the root folder:

```bash
cd frontend
npm install
npm run dev
```

Then open the forwarded frontend URL from the **Ports** tab for port `5173`.

It will look similar to this:

```text
https://your-codespace-name-5173.app.github.dev
```

#### Important Codespaces note

If the frontend loads but API requests fail, check the following:

- The backend is running.
- Port `8080` is forwarded in Codespaces.
- The `frontend/.env` file points to the Codespaces backend URL, not `localhost`.
- The frontend was restarted after changing the `.env` file.

After changing `frontend/.env`, stop and restart the frontend server:

```bash
npm run dev
```

---

### 1.5. Swagger UI / API Documentation

The backend includes an OpenAPI specification file located at:

```text
backend/app/src/main/resources/openapi.yaml
```

This file describes the available API endpoints, request bodies, response formats, and backend API behaviour.

#### Option 1: Open Swagger UI from the running backend

Start the backend first:

```bash
cd backend
./gradlew run
```

Then open Swagger UI in your browser.

For local development, try:

```text
http://localhost:8080/swagger
```

or:

```text
http://localhost:8080/swagger-ui
```

If the project exposes Swagger under a different route, check the backend routing configuration or the `Application.kt` file.

#### Option 2: Open the OpenAPI YAML file manually

You can also view the API documentation by opening the OpenAPI file directly in an editor or by importing it into Swagger Editor.

File location:

```text
backend/app/src/main/resources/openapi.yaml
```

Swagger Editor can be used by copying the contents of `openapi.yaml` into the editor.

#### Running Swagger UI in GitHub Codespaces

If the backend is running in Codespaces, open the **Ports** tab and copy the forwarded URL for port `8080`.

The Swagger UI URL will look similar to:

```text
https://your-codespace-name-8080.app.github.dev/swagger
```

or:

```text
https://your-codespace-name-8080.app.github.dev/swagger-ui
```

If Swagger UI does not open, confirm that:

- The backend is running.
- Port `8080` is forwarded.
- The Swagger route is enabled in the backend.
- The `openapi.yaml` file exists in `backend/app/src/main/resources/`.

---

### 1.6. Testing

#### Backend tests

To run the backend tests, make sure you are inside the `backend` folder:

```bash
cd backend
```

Run the tests using the Gradle wrapper:

```bash
./gradlew test
```

#### Frontend tests

To run the frontend tests, make sure you are inside the `frontend` folder:

```bash
cd frontend
```

Run the tests using npm:

```bash
npm test
```

---

## 2. Tech Stack

### 2.1. Programming Languages

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" width="60"/>
</p>

#### 2.1.1. JavaScript

JavaScript is used in the frontend to implement interactive and dynamic user interfaces.

It handles client-side logic, manages user interactions, and communicates with the backend via API calls to retrieve and update data.

#### 2.1.2. Kotlin

Kotlin is used as the main backend language to build the server-side components of the application.

It is responsible for defining data models, implementing API endpoints, and handling communication with the database through the Exposed library.

---

### 2.2. Frameworks

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ktor/ktor-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="60" />
</p>

#### 2.2.1. React

React is used as the frontend library to develop the user interface.

It allows the application to be built using reusable components and efficiently manages state and rendering, enabling dynamic and responsive user interactions.

#### 2.2.2. Ktor

Ktor is used as the backend framework to build and run the server.

It handles HTTP requests, routing, and API development, enabling communication between the frontend and the backend services.

#### 2.2.3. Tailwind CSS

Tailwind CSS is used as a utility-first CSS framework for styling the user interface.

It provides a set of pre-defined utility classes that enable fast and consistent design, making it easier to build responsive and visually appealing components.

---

### 2.3. Databases

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jetbrains/jetbrains-original.svg" width="60" />
</p>

#### 2.3.1. SQLite

SQLite is used as the database to store and manage application data.

It provides a lightweight and efficient solution for handling structured data, including user information, exercise records, and training programmes.

#### 2.3.2. Exposed

Exposed is used as a Kotlin SQL library to interact with the database.

It provides a type-safe way to define database schemas and perform queries, simplifying database operations within the application.

---

## 3. Project Architecture

The project is split into two main applications: a React frontend and a Kotlin Ktor backend.

The frontend is responsible for the user interface and client-side interactions, while the backend handles API requests, business logic, authentication, database access, and data persistence.

```text
.
├── frontend/                         # React frontend application
├── backend/                          # Kotlin Ktor backend application
├── fitness-project.postman_collection.json
│                                      # Postman collection for testing backend API endpoints
├── README.md                         # Main project documentation
├── package-lock.json                 # Root-level npm lock file, if root scripts are used
└── script.txt                        # Utility script or generated file list
```

---

### 3.1. Frontend Structure

The `frontend` folder contains the React application built with Vite.

It includes page components, reusable UI components, route protection logic, API service files, styling, tests, and public assets.

```text
frontend/
├── public/                           # Static files served directly by Vite
├── src/                              # Main frontend source code
├── index.html                        # Main HTML entry point
├── package.json                      # Frontend dependencies and npm scripts
├── package-lock.json                 # Locked frontend dependency versions
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
├── postcss.config.mjs                # Alternative PostCSS module configuration
├── eslint.config.js                  # ESLint configuration
├── .gitignore                        # Frontend ignored files
└── README.md                         # Frontend-specific documentation
```

#### 3.1.1. `frontend/public`

The `public` folder contains assets that are available directly from the browser without being imported into React components.

```text
frontend/public/
├── defaults/                         # Default banner images for programs and races
├── exercises/                        # Exercise demonstration GIFs
├── categories/                       # Category icons for body parts and activity types
├── fitness.mp4                       # General fitness video asset
├── home-video.mp4                    # Home page background or hero video
├── q1.mp4 ... q6.mp4                 # Onboarding or question-related videos
├── logo.png                          # Application logo
├── favicon.png                       # Browser favicon
├── favicon-rect.png                  # Alternative rectangular favicon
├── calendar-icon.svg                 # Calendar UI icon
├── watch.svg                         # Watch UI icon
├── yoga.svg                          # Yoga UI icon
├── error404.svg                      # Not found page illustration
└── icons.svg                         # Shared SVG icon asset
```

#### 3.1.2. `frontend/src`

The `src` folder contains the main React application code.

```text
frontend/src/
├── features/                         # Feature-based pages and components
├── common/                           # Shared reusable UI and layout components
├── routing/                          # Application route definitions and route guards
├── services/                         # API service modules for backend communication
├── tests/                            # Frontend unit tests
├── assets/                           # Imported frontend assets
├── App.jsx                           # Root React component
├── main.jsx                          # React application entry point
├── App.css                           # App-level styles
└── index.css                         # Global styles and Tailwind imports
```

---

### 3.2. Frontend Features

The `features` directory is organised by major application areas.

Each feature contains its own pages, components, hooks, modals, and utilities where needed.

```text
frontend/src/features/
├── home/                             # Landing or home page
├── auth/                             # Login, signup, onboarding questions, and validation
├── training/                         # Training dashboard, calendar, statistics, and exercises
├── activities/                       # Programs, races, activity history, and related modals
└── chats/                            # Chat interface, conversations, messages, and socket hooks
```

#### `features/home`

Contains the main home page shown to users.

```text
frontend/src/features/home/
└── HomePage.jsx
```

#### `features/auth`

Contains authentication and onboarding screens.

```text
frontend/src/features/auth/
├── Login.jsx                         # Login page
├── Signup.jsx                        # Signup page
├── Questions.jsx                     # Onboarding questions page
└── utils/
    ├── loginValidation.js            # Login form validation logic
    └── registerValidation.js         # Register form validation logic
```

#### `features/training`

Contains the training page and components used to display training progress, selected programs, exercises, metrics, and calendar-based workout information.

```text
frontend/src/features/training/
├── TrainingPage.jsx
└── components/
    ├── TrainingCalendar/             # Calendar UI for training days
    ├── TrainingStatistics.jsx        # Training statistics summary
    ├── TrainingProgramSelector.jsx   # Program selection component
    ├── TrainingOverviewRow.jsx       # Overview row for training data
    ├── TrainingContentList.jsx       # List of training content or exercises
    └── hooks/                        # Training-related custom React hooks
```

#### `features/activities`

Contains the activities area, including program management, race management, activity history, creation modals, detail modals, and shared activity controls.

```text
frontend/src/features/activities/
├── ActivitiesPage.jsx
├── components/
│   └── ActivitiesHistory.jsx
├── programs/                         # Workout program management
└── races/                            # Race/event management
```

The `programs` folder includes program grids, headers, footers, hooks, create modals, detail modals, and formatting utilities.

```text
frontend/src/features/activities/programs/
├── components/                       # Program header, footer, and grid components
├── hooks/                            # Program data-fetching and state hooks
├── modals/                           # Create, detail, and view-all program modals
├── utils/                            # Program formatting helpers
└── index.jsx                         # Program feature entry component
```

The `races` folder follows a similar structure for race-related features.

```text
frontend/src/features/activities/races/
├── components/                       # Race header, footer, and grid components
├── hooks/                            # Race data-fetching and state hooks
├── modals/                           # Create, detail, and view-all race modals
└── index.jsx                         # Race feature entry component
```

#### `features/chats`

Contains the chat system, including the sidebar, search, conversation list, chat window, message cards, message hooks, conversation hooks, and socket handling.

```text
frontend/src/features/chats/
├── components/
│   ├── ChatSidebar/                  # Conversation list, filters, search, and group creation
│   └── ChatWindow/                   # Messages, auto-scroll, socket connection, and chat UI
└── index.jsx                         # Chat feature entry component
```

---

### 3.3. Shared Frontend Folders

#### `frontend/src/common`

The `common` folder contains reusable UI components and layout components used across multiple pages.

```text
frontend/src/common/
├── ui/                               # Shared interface components
└── layout/                           # Shared layout and navigation components
```

Important shared components include:

```text
frontend/src/common/ui/
├── auth/AuthInput.jsx                # Reusable authentication input
├── activities/                       # Shared activity control cards, grids, headers, footers, modals
├── BackgroundVideo.jsx               # Reusable video background component
├── Modal.jsx                         # Generic modal component
├── ExerciseCard.jsx                  # Reusable exercise card component
└── AnimatedError.jsx                 # Animated error display component
```

```text
frontend/src/common/layout/
├── PublicNavbar.jsx                  # Navigation for public pages
├── PrimaryNavbar.jsx                 # Navigation for authenticated pages
└── PublicLayout.jsx                  # Layout wrapper for public routes
```

#### `frontend/src/routing`

The `routing` folder contains route definitions and route guard components.

These control which pages are public, protected, onboarding-only, or unavailable.

```text
frontend/src/routing/
├── AppRoutes.jsx                     # Main route configuration
├── DashboardRoute.jsx                # Dashboard route wrapper
├── PublicOnlyRoute.jsx               # Prevents logged-in users from accessing public-only pages
├── OnboardingRoute.jsx               # Handles onboarding-specific access
├── ProtectedRoute.jsx                # Protects authenticated routes
└── NotFoundRoute.jsx                 # 404 route
```

#### `frontend/src/services`

The `services` folder contains API helper modules.

Each file groups requests for a specific backend resource, keeping backend communication separate from UI components.

```text
frontend/src/services/
├── api.js                            # Shared API client configuration
├── user.js                           # User API requests
├── profile.js                        # Profile API requests
├── activity.js                       # Activity API requests
├── activityMetric.js                 # Activity metric API requests
├── exercise.js                       # Exercise API requests
├── category.js                       # Category API requests
├── muscleGroup.js                    # Muscle group API requests
├── metricType.js                     # Metric type API requests
├── program.js                        # Program API requests
├── programSchedule.js                # Program schedule API requests
├── programExercise.js                # Program exercise API requests
├── programExerciseMetric.js          # Program exercise metric API requests
├── race.js                           # Race API requests
├── conversation.js                   # Conversation API requests
├── message.js                        # Message API requests
└── chat.js                           # Chat-specific API or socket helpers
```

#### `frontend/src/tests`

Contains frontend unit tests for validation and formatting logic.

```text
frontend/src/tests/
├── formatter.test.js
├── loginValidation.test.js
└── registerValidation.test.js
```

---

### 3.4. Backend Structure

The `backend` folder contains the Kotlin Ktor server application.

It uses Gradle for building and running the project.

```text
backend/
├── app/                              # Main backend application module
├── gradle/                           # Gradle wrapper and version catalog
├── gradlew                           # Unix Gradle wrapper script
├── gradlew.bat                       # Windows Gradle wrapper script
├── settings.gradle.kts               # Gradle project settings
├── gradle.properties                 # Gradle configuration properties
├── .gitignore                        # Backend ignored files
└── .gitattributes                    # Git attributes configuration
```

#### `backend/app`

The `app` folder is the main backend module.

```text
backend/app/
├── src/main/                         # Backend production source code
├── src/test/                         # Backend test source code
├── build.gradle.kts                  # Backend module build configuration
└── fitness_app.db                    # SQLite database file
```

---

### 3.5. Backend Application Code

The main Kotlin backend code is located in:

```text
backend/app/src/main/kotlin/org/fitnessapp/
```

```text
org/fitnessapp/
├── Application.kt                    # Ktor application entry point and server configuration
├── Database.kt                       # Database setup and connection configuration
├── security/                         # Authentication and JWT utilities
├── models/                           # Database table models and entities
├── data/                             # Seeders for initial reference data
├── routes/                           # API route definitions
└── services/                         # Business logic and database operations
```

#### `security`

Contains security-related backend logic.

```text
security/
└── JWTService.kt                     # JWT creation, validation, and authentication support
```

#### `models`

The `models` folder defines the database structure and domain entities used by the backend.

```text
models/
├── User.kt                           # User account model
├── Profile.kt                        # User profile model
├── Activity.kt                       # Physical activity model
├── ActivityMetric.kt                 # Metrics recorded for activities
├── Exercise.kt                       # Exercise model
├── Category.kt                       # Exercise or activity category model
├── MuscleGroup.kt                    # Muscle group model
├── MetricType.kt                     # Type of measurable metric
├── Program.kt                        # Training program model
├── ProgramSchedule.kt                # Program schedule model
├── ProgramExercise.kt                # Exercise assigned to a program
├── ProgramExerciseMetric.kt          # Metrics for program exercises
├── Race.kt                           # Race or event model
├── RaceCategory.kt                   # Race category model
├── Conversation.kt                   # Chat conversation model
├── ConversationParticipant.kt        # Users participating in conversations
├── Message.kt                        # Chat message model
├── ExerciseCategory.kt               # Relationship between exercises and categories
├── ExerciseMetricType.kt             # Relationship between exercises and metric types
└── ExerciseMuscleGroup.kt            # Relationship between exercises and muscle groups
```

#### `data`

The `data` folder contains seeders used to populate the database with initial reference data such as exercises, categories, muscle groups, and metric types.

```text
data/
├── CategorySeeder.kt
├── ExerciseCategorySeeder.kt
├── ExerciseMetricTypeSeeder.kt
├── ExerciseMuscleGroupSeeder.kt
├── ExerciseSeeder.kt
├── MetricTypeSeeder.kt
└── MuscleGroupSeeder.kt
```

#### `routes`

The `routes` folder defines the HTTP API endpoints.

Each route file exposes endpoints for one resource or feature area.

```text
routes/
├── UserRoutes.kt
├── ProfileRoutes.kt
├── ActivityRoutes.kt
├── ActivityMetricRoutes.kt
├── ExerciseRoutes.kt
├── CategoryRoutes.kt
├── MuscleGroupRoutes.kt
├── MetricTypeRoutes.kt
├── ProgramRoutes.kt
├── ProgramScheduleRoutes.kt
├── ProgramExerciseRoutes.kt
├── ProgramExerciseMetricRoutes.kt
├── RaceRoutes.kt
├── ConversationRoutes.kt
├── MessageRoutes.kt
└── ChatRoutes.kt
```

#### `services`

The `services` folder contains the business logic used by the API routes.

Services interact with the database models and keep route files focused on request and response handling.

```text
services/
├── UserService.kt
├── ProfileService.kt
├── ActivityService.kt
├── ActivityMetricService.kt
├── ExerciseService.kt
├── CategoryService.kt
├── MuscleGroupService.kt
├── MetricTypeService.kt
├── ProgramService.kt
├── ProgramScheduleService.kt
├── ProgramExerciseService.kt
├── ProgramExerciseMetricService.kt
├── RaceService.kt
├── ConversationService.kt
├── ConversationParticipantService.kt
├── MessageService.kt
└── ExerciseMetricType.kt
```

---

### 3.6. Backend Resources

The backend resources folder contains configuration files, API documentation, and CSV data used to seed the database.

```text
backend/app/src/main/resources/
├── application.conf                  # Ktor application configuration
├── openapi.yaml                      # OpenAPI specification for the backend API
└── data/                             # CSV seed data
```

```text
backend/app/src/main/resources/data/
├── categories.csv
├── exercises.csv
├── exercise_categories.csv
├── exercise_metric_types.csv
├── exercise_muscle_groups.csv
├── metric_types.csv
└── muscle_groups.csv
```

---

### 3.7. Backend Tests

Backend tests are stored under `src/test` and mainly cover the service layer.

These tests check that backend business logic and database operations work correctly.

```text
backend/app/src/test/kotlin/org/fitnessapp/services/
├── UserServiceTest.kt
├── ProfileServiceTest.kt
├── ActivityTest.kt
├── ActivityMetricTest.kt
├── ExerciseServiceTest.kt
├── CategoryTest.kt
├── MuscleGroupServiceTest.kt
├── MetricTypeServiceTest.kt
├── ProgramServiceTest.kt
├── ProgramScheduleServiceTest.kt
├── ProgramExerciseServiceTest.kt
├── ProgramExerciseMetricServiceTest.kt
├── RaceServiceTest.kt
├── ConversationServiceTest.kt
├── ConversationParticipantTest.kt
├── MessageServiceTest.kt
└── ExerciseMetricTest.kt
```

---

### 3.8. API Documentation and Testing Files

```text
fitness-project.postman_collection.json
```

This Postman collection can be imported into Postman to test the backend API endpoints manually.

```text
backend/app/src/main/resources/openapi.yaml
```

This file describes the backend API using the OpenAPI format.

It can be used to document available endpoints, request bodies, responses, and API behaviour.

---

### 3.9. Development and IDE Files

Some files are related to development tools and local environment configuration.

```text
.idea/                               # JetBrains IDE project settings
.gitignore                           # Files and folders ignored by Git
.gitattributes                       # Git file handling rules
```

The `.idea` folder is generated by JetBrains IDEs such as IntelliJ IDEA.

It stores local project configuration and is not part of the application runtime.
