# VibeFlow - Modern Project Management & Kanban Board

VibeFlow is a high-performance, full-stack project management platform designed for teams who need clarity and speed. Featuring a dynamic Kanban board, real-time team insights, and granular time tracking, VibeFlow streamlines the transition from "Backlog" to "Done."

![VibeFlow Banner](https://img.shields.io/badge/VibeFlow-Project%20Management-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/.NET%2010-React%2018-Vite-green?style=for-the-badge)

---

## 🚀 Key Features

### 📋 Dynamic Kanban Board
- **Drag & Drop Workflow**: Seamlessly move tasks across Backlog, ToDo, InProgress, Review, QA, and Done.
- **Task Management**: Create, edit, and assign tasks with ease.
- **Real-time Updates**: Instant UI feedback on state changes.

### 👥 Team Collaboration
- **Member Directory**: View all project contributors and their roles.
- **Assignment Tracking**: Transparent task ownership and historical assignment tracking.

### 📊 Advanced Analytics & Reports
- **Time Tracking**: Log hours spent on specific tasks with detailed descriptions.
- **Contribution Charts**: Visual progress bars showing team time allocation.
- **Activity Logs**: Granular audit trails showing exactly who did what and when.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS (Stitch Design System).
- **Backend**: C# .NET 10 Web API, Entity Framework Core.
- **Database**: SQLite (Production-ready file-based storage).
- **Authentication**: JWT (JSON Web Tokens) with Secure Password Hashing (BCrypt).
- **Testing**: xUnit, FluentAssertions (Backend) | Vitest, React Testing Library (Frontend).

---

## 📦 Getting Started (Docker) - Recommended

VibeFlow is fully containerized for easy deployment.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### Quick Start (Public Docker Images)
If you don't want to build from source, you can pull the official images directly from Docker Hub:
```powershell
# Pull and run the latest version
docker run -p 8080:8080 akashkendre/vibeflow-api:latest
docker run -p 80:80 akashkendre/vibeflow-web:latest
```

### Build from Source
1. Clone the repository.
2. Run the following command in the project root:
   ```powershell
   docker compose up --build
   ```

3. Access the application:
   - **Frontend**: [http://localhost](http://localhost)
   - **API Docs**: [http://localhost:5296/openapi/v1.json](http://localhost:5296/openapi/v1.json)


---

## 💻 Local Development Setup

### Backend (.NET 10)
1. Navigate to the API folder:
   ```bash
   cd backend/VibeFlow.API
   ```
2. Run the application:
   ```bash
   dotnet run
   ```
   *The API will start on `http://localhost:5296`.*

### Frontend (Vite + React)
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
   *The app will start on `http://localhost:5173`.*

---

## 🧪 Testing

### Backend (xUnit)
Covering Authentication, Task Logic, and Analytical Calculations.
```bash
cd backend/VibeFlow.Tests
dotnet test
```

### Frontend (Vitest)
Covering UI Component Rendering and Dashboard Math.
```bash
cd frontend
npm run test
```

---

## 📄 API Reference

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
