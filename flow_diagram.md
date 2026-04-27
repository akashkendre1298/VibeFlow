# VibeFlow - Application Flow & Architecture

This document provides a visual overview of how users interact with VibeFlow and how the underlying components communicate.

## User Flow Diagram

The following diagram illustrates the primary user journey from authentication to task management and insights.

```mermaid
graph TD
    Start((User Starts)) --> AuthCheck{Authenticated?}
    
    AuthCheck -- No --> Register[Register Page]
    Register --> Login[Login Page]
    AuthCheck -- No --> Login
    
    Login -- Success --> Dashboard[Project Board - Kanban]
    AuthCheck -- Yes --> Dashboard
    
    Dashboard --> CreateTask[Create New Task]
    CreateTask --> Dashboard
    
    Dashboard --> TaskDetails[Task Details Modal]
    
    subgraph "Task Actions"
        TaskDetails --> UpdateStatus[Update Status]
        TaskDetails --> AssignUser[Assign Team Member]
        TaskDetails --> LogWork[Log Work Hours]
        TaskDetails --> SetDueDate[Set/Change Due Date]
    end
    
    UpdateStatus --> Dashboard
    AssignUser --> Dashboard
    
    Dashboard --> NavMenu[Navigation Menu]
    NavMenu --> Reports[Project Insights - Reports]
    NavMenu --> Team[Team Management]
    
    Reports --> Dashboard
    Team --> Dashboard
    
    NavMenu --> Logout[Logout]
    Logout --> Login
```

## System Architecture

VibeFlow follows a modern client-server architecture with a centralized database.

```mermaid
graph LR
    subgraph "Client Side (Frontend)"
        React[React + Vite App]
        Context[Auth Context]
        Components[UI Components]
        React --> Context
        React --> Components
    end

    subgraph "Server Side (Backend)"
        API[ASP.NET Core Web API]
        EF[Entity Framework Core]
        Auth[JWT Authentication]
        API --> Auth
        API --> EF
    end

    subgraph "Data Layer"
        DB[(PostgreSQL Database)]
    end

    React -- "REST API (JSON / JWT)" --> API
    EF -- "SQL Queries" --> DB
```

## Core Workflows

### 1. Task Lifecycle
`Backlog` → `To Do` → `In Progress` → `Review` → `QA` → `Done`

### 2. Time Tracking
`User selects task` → `Enters hours & description` → `API records WorkLog` → `Report aggregate updates`

### 3. Authentication
`Credentials` → `API validates` → `JWT returned` → `Stored in LocalStorage` → `Attached to subsequent headers`
