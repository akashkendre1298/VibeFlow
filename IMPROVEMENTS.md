# VibeFlow - Refactoring & Improvement Roadmap

Based on the recent Peer Review Report, here are the actionable items and weaknesses that need to be addressed to ensure the project is fully production-ready.

## 🔴 High Priority

### 1. Development vs Production Database Mismatch
* **Location:** `backend/VibeFlow.API/appsettings.json` (lines 5-10)
* **Problem:** Currently, SQLite is used in development, while PostgreSQL is used in production. This creates a risk of deployment failures due to subtle SQL dialect differences.
* **Action Item:** 
  - Use PostgreSQL consistently across all environments.
  - Set up connection pooling and consistent migration scripts.
  - Update `appsettings.Development.json` to utilize a local PostgreSQL instance rather than SQLite.

### 2. Missing Integration Tests
* **Location:** Entire backend test suite.
* **Problem:** There are no end-to-end tests verifying complete user workflows across the frontend and backend.
* **Action Item:** 
  - Implement Web API integration tests using `TestServer`.
  - Add at least 3 overarching integration tests covering the core workflow: `Login → Create Task → Assign → Log Work`.
  - Use Mock Service Worker (MSW) or similar tools for frontend API mocking/integration.
  - Create test data factories.

## 🟡 Medium Priority

### 3. Frontend Test Coverage Gap
* **Location:** `frontend/src/__tests__/`
* **Problem:** Basic test coverage focuses solely on component rendering, lacking comprehensive user interaction / integration tests. This risks UI regression in production.
* **Action Item:** 
  - Add Cypress or React Testing Library tests for complex behaviors (drag-and-drop workflows, form submissions).
  - Create a new `frontend/src/__tests__/integration/` directory containing at least 5 integration tests.
  - Set up a test coverage reporting utility.

### 4. Error Handling Consistency
* **Location:** `backend/VibeFlow.API/Controllers/TasksController.cs` (lines 55-87)
* **Problem:** Some endpoints incorrectly return HTTP 500 for validation errors instead of HTTP 400 Bad Request, leading to difficult client-side error handling.
* **Action Item:** 
  - Standardize error responses using the `ProblemDetails` format.
  - Implement a global exception handling middleware.
  - Optionally create a `BaseController` to enforce consistent error-handling methods.
  - Map validation errors correctly to HTTP 400.

### 5. Add CI/CD Pipeline
* **Location:** Repository root.
* **Problem:** No automated quality checks or build processes are configured.
* **Action Item:** 
  - Set up GitHub Actions for automated unit and integration testing.
  - Configure automated Docker image building.
  - Add a staging environment for deployments.

---

