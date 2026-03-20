# 💪 Sila | Fitness App

### Overview

A fitness tracking application that allows users to plan workouts, record activities, and monitor their progress over time. It supports a wide range of exercise types and is suitable for both casual users and individuals training for specific events.

## 1. Getting started

* Ensure you have Java installed before running the backend.
* Before executing any commands, ensure you are in the project’s root directory.

### 1.1. Setup the Backend Application
From the root folder of the project, navigate to the backend directory:
```bash
cd backend
```

Build and start the backend server using the Gradle wrapper:
```bash
./gradlew run
```

The server will start on your local machine at `http://localhost:8080/`

---

### 1.2. Setup the Frontend Application
From the root folder of the project, navigate to the frontend directory:
```bash
cd frontend
```

Install the required dependencies:
```bash
npm install
```

Start the application:
```bash
npm run dev
```

The application will start on your local machine.

Open in your browser:
`http://localhost:5173/`

## 2. Tech Stack


### 2.1. Programming languages:
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" width="60"/>
</p>

#### 2.1.1. JavaScript
JavaScript is used in the frontend to implement interactive and dynamic user interfaces.
It handles client-side logic, manages user interactions, and communicates with the backend via API calls to retrieve and update data

#### 2.1.2. Kotlin

Kotlin is used as the main backend language to build the server-side components of the application. 
It is responsible for defining data models, implementing API endpoints, and handling communication with the database through the Exposed library

### 2.2. Frameworks:

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ktor/ktor-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="60" />
</p>

#### 2.2.1 React

React is used as the frontend library to develop the user interface. 
It allows the application to be built using reusable components and efficiently manages state and rendering, enabling dynamic and responsive user interactions

#### 2.2.2 Ktor

Ktor is used as the backend framework to build and run the server. 
It handles HTTP requests, routing, and API development, enabling communication between the frontend and the backend services

#### 2.2.3 Tailwind CSS

Tailwind CSS is used as a utility-first CSS framework for styling the user interface. 
It provides a set of pre-defined utility classes that enable fast and consistent design, making it easier to build responsive and visually appealing components

### 2.3. Databases:
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" width="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jetbrains/jetbrains-original.svg" width="60" />
</p>

#### 2.3.1 SQLite

SQLite is used as the database to store and manage application data. It provides a lightweight and efficient solution for handling structured data, including user information, exercise records, and training programmes

#### 2.3.2 Exposed

Exposed is used as a Kotlin SQL library to interact with the database. It provides a type-safe way to define database schemas and perform queries, simplifying database operations within the application

