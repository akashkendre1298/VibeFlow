# VibeFlow - Modern Project Management & Kanban Board

VibeFlow is a high-performance, full-stack project management platform designed for teams who need clarity and speed. Featuring a dynamic Kanban board, real-time team insights, and granular time tracking, VibeFlow streamlines the transition from "Backlog" to "Done."

![VibeFlow Banner](https://img.shields.io/badge/VibeFlow-Project%20Management-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/.NET%208-React%2018-Vite-green?style=for-the-badge)
![Database](https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge)

---

## 🚀 Key Features

### 📋 Dynamic Kanban Board
- **Drag & Drop Workflow**: Seamlessly move tasks across Backlog, ToDo, InProgress, Review, QA, and Done.
- **Task Management**: Create, edit, and assign tasks with ease.
- **Real-time Updates**: Instant UI feedback on state changes.

### 👥 Team Collaboration
- **Member Directory**: View all project contributors and their roles.
- **Assignment Tracking**: Transparent task ownership and historical assignment/due-date timeline tracking.

### 📊 Advanced Analytics & Reports
- **Time Tracking**: Log hours spent on specific tasks with detailed descriptions.
- **Contribution Charts**: Visual progress bars showing team time allocation.
- **Activity Logs**: Granular audit trails showing exactly who did what and when.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS (Premium Obsidian Theme).
- **Backend**: C# .NET 10 Web API, Entity Framework Core.
- **Database**: PostgreSQL (Containerized for local deployment and robust for production).
- **Authentication**: JWT (JSON Web Tokens) with Secure Password Hashing (BCrypt).
- **Testing**: xUnit, FluentAssertions (Backend) | Vitest, React Testing Library + Mock Service Worker (Frontend Integration).

---

## 📦 Option 1: Full Docker Deployment (Easiest)

VibeFlow is fully containerized for a zero-configuration deployment. This method spins up the Database, Backend API, and Frontend completely inside Docker.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### Build & Run
1. Clone the repository and navigate to the root directory.
2. Run the following command:
   ```powershell
   docker compose up --build -d
   ```
3. Access the application:
   - **Frontend UI**: [http://localhost](http://localhost)
   - **API Docs**: [http://localhost:5296/openapi/v1.json](http://localhost:5296/openapi/v1.json)

---

## 💻 Option 2: Local Development Setup (Source Code)

If you intend to write code or modify the application locally, follow this guide to run the stack natively on your machine, while utilizing Docker solely for hosting the database engine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) & NPM
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Required for the Database)

### Step 1: Start the Database via Docker
Before starting the backend, boot up the Postgres Engine locally matching production specifications:
```powershell
docker-compose up postgres -d
```
> [!NOTE] 
> This spins up the database automatically exposed on `localhost:5432`. No manual PostgreSQL installation is required on your Windows/Mac host system.

### Step 2: Run the Backend (.NET 8)
1. Navigate to the API folder:
   ```powershell
   cd backend/VibeFlow.API
   ```
2. Run the application:
   ```powershell
   dotnet run
   ```
   *The API will start on `http://localhost:5296`. EF Core will automatically migrate and structure your database schemas on boot.*

### Step 3: Run the Frontend (React + Vite)
1. Open a new terminal and navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the dev server:
   ```powershell
   npm run dev
   ```
   *The app will start on `http://localhost:5173`.*

---

## 🧪 Testing Suites

VibeFlow ships with over 35 automated integration and unit test workflows built rigidly into the pipeline!

### Backend (xUnit)
Covering 17 workflows encompassing Authentication cryptography, Task Logic constraints, and Analytical Calculations.
```powershell
cd backend/VibeFlow.Tests
dotnet test
```

### Frontend (Vitest & React Testing Library)
Covering 22 workflows via heavily simulated DOM instances modeling Drag and Drop trees, Task modal patching, route protections, and time logger behavior using `Mock Service Worker (MSW)`.
```powershell
cd frontend
# Run the test validations
npm run test

# Render line-by-line coverage architecture maps
npm run test:coverage
```

---

## 📄 Core API References

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register a new user |
| `/api/auth/login` | `POST` | Receive JWT token |
| `/api/tasks` | `GET` | Fetch all board tasks |
| `/api/tasks` | `POST` | Create a new task |
| `/api/tasks/{id}/worklogs` | `POST` | Log time to a task |
| `/api/reports/time` | `GET` | Get aggregated time reports |

---

## 📜 License
Internal Project - All Rights Reserved.
