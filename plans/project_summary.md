# VibeFlow Project Summary

## Overview
VibeFlow is a modern, full-stack project management and Kanban board platform designed for teams requiring clarity, speed, and real‑time collaboration. It provides a dynamic drag‑and‑drop Kanban board, team member management, granular time tracking, and advanced analytics—streamlining the workflow from "Backlog" to "Done."

## Key Features

### 📋 Dynamic Kanban Board
- **Drag‑and‑Drop Workflow**: Move tasks seamlessly across eight columns: Backlog, ToDo, InProgress, Review, QA, Done, OnHold, Cancelled.
- **Task Management**: Create, edit, assign, and filter tasks with real‑time UI updates.
- **Order Persistence**: Tasks maintain custom ordering within each column.

### 👥 Team Collaboration
- **Member Directory**: View all project contributors, roles, and assignment history.
- **Assignment Tracking**: Transparent task ownership with historical audit logs (AssignmentHistory model).

### 📊 Advanced Analytics & Reports
- **Time Tracking**: Log hours spent on specific tasks with detailed descriptions (WorkLog model).
- **Contribution Charts**: Visual progress bars showing team time allocation.
- **Activity Logs**: Granular audit trails showing who did what and when.

### 🔐 Authentication & Security
- JWT‑based authentication with secure password hashing (BCrypt).
- Role‑based access control (future‑ready).
- Protected routes on the frontend.

## Tech Stack

### Backend
- **Framework**: C# .NET 10 Web API
- **ORM**: Entity Framework Core
- **Database**: SQLite (file‑based, production‑ready)
- **Authentication**: JWT (JSON Web Tokens)
- **Dependencies**: BCrypt.Net‑Next, Microsoft.EntityFrameworkCore.Sqlite, Microsoft.AspNetCore.Authentication.JwtBearer, Microsoft.AspNetCore.OpenApi
- **Testing**: xUnit, FluentAssertions

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: React Context (AuthContext)
- **Routing**: React Router DOM v7
- **UI Libraries**: Lucide React icons, Vanilla CSS (Stitch Design System)
- **Drag‑and‑Drop**: @dnd‑kit/core, @dnd‑kit/sortable
- **HTTP Client**: Axios with request interceptors for JWT
- **Testing**: Vitest, React Testing Library, jsdom

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Multi‑service setup (backend + frontend)
- **Volumes**: Persistent SQLite data storage

## Architecture

### Backend Architecture
- **Layered Design**: Controllers → Services → Data Access (DbContext) → Models
- **Models**:
  - `User`: Email, password hash, name
  - `TaskItem`: Title, description, status, priority, assignee, due date, order
  - `WorkLog`: Task‑related time entries with duration and description
  - `AssignmentHistory`: Tracks task reassignments with old/new assignee and timestamp
- **Services**:
  - `AuthService`: Registration, login, JWT generation
  - `TaskService`: CRUD operations, status transitions, ordering
  - `ReportService`: Time aggregation, contribution calculations
- **Database**: SQLite with EF Core migrations; relationships configured with foreign keys and cascading behaviors.

### Frontend Architecture
- **Page‑Based Routing**: Login, Register, Board (main Kanban), Team, Reports
- **Component Library**: Reusable components (Navbar, Sidebar, TaskCard, TaskModal, Column)
- **State Management**: AuthContext for user authentication state
- **API Integration**: Axios instance with base URL `/api` and automatic JWT header injection
- **Drag‑and‑Drop**: Full‑featured DnD using @dnd‑kit with custom sensors and overlay

## Project Structure

```
c:/AI‑Project/
├── docker‑compose.yml          # Multi‑container definition
├── README.md                   # Comprehensive documentation
├── backend/
│   ├── VibeFlow.API/
│   │   ├── Controllers/        # API endpoints
│   │   ├── Data/               # DbContext
│   │   ├── DTOs/               # Data transfer objects
│   │   ├── Migrations/         # EF Core migrations
│   │   ├── Models/             # Domain entities
│   │   ├── Services/           # Business logic
│   │   ├── Program.cs          # Startup & middleware
│   │   └── VibeFlow.API.csproj
│   └── VibeFlow.Tests/         # xUnit test suite
└── frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── context/            # React context (AuthContext)
    │   ├── pages/              # Route‑based pages
    │   ├── services/           # API client
    │   ├── __tests__/          # Component tests
    │   └── App.jsx             # Root component
    ├── vite.config.js          # Vite configuration with proxy
    └── package.json            # Dependencies & scripts
```

## Deployment & Development

### Docker (Recommended)
- **Quick Start**: `docker compose up --build`
- **Public Images**: Available on Docker Hub (`akashkendre/vibeflow‑api`, `akashkendre/vibeflow‑web`)
- **Ports**:
  - Frontend: `http://localhost`
  - Backend API: `http://localhost:5296`
  - OpenAPI docs: `http://localhost:5296/openapi/v1.json`

### Local Development
1. **Backend**: `cd backend/VibeFlow.API && dotnet run`
2. **Frontend**: `cd frontend && npm install && npm run dev`
3. **Testing**:
   - Backend: `cd backend/VibeFlow.Tests && dotnet test`
   - Frontend: `cd frontend && npm run test`

## Testing Strategy

### Backend (xUnit)
- **Unit Tests**: AuthService, TaskService, ReportService
- **Integration Tests**: AuthIntegrationTests, TasksControllerTests
- **Database**: In‑memory SQLite for isolated test runs

### Frontend (Vitest + React Testing Library)
- **Component Tests**: Board, Login, Reports
- **Integration**: User interactions, API mocking
- **Environment**: jsdom simulated browser

## API Endpoints (Key)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login`    | POST | Authenticate and receive JWT |
| `/api/tasks`         | GET  | Fetch all board tasks |
| `/api/tasks`         | POST | Create a new task |
| `/api/tasks/{id}/worklogs` | POST | Log time to a task |
| `/api/reports/time`  | GET  | Get aggregated time reports |
| `/api/users`         | GET  | List all team members |

## Current Status & Future Enhancements

- **Current**: Fully functional MVP with core Kanban, authentication, time tracking, and reporting.
- **Future**: Real‑time updates (SignalR), advanced role‑based permissions, email notifications, mobile‑responsive design, and export capabilities (PDF/CSV).

## License
Internal Project – All Rights Reserved.

---

*Summary generated from architectural analysis of the VibeFlow repository.* 