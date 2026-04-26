import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import App from '../../App';

const FAKE_PAYLOAD = btoa(JSON.stringify({ nameid: 1, email: 'test@test.com', unique_name: 'Test User' }));
const FAKE_TOKEN = `header.${FAKE_PAYLOAD}.signature`;

const handlers = [
  http.get('*/api/auth/me', () => {
    return HttpResponse.json({ id: 1, name: 'Test User', email: 'test@test.com' });
  }),
  http.get('*/api/tasks', () => {
    return HttpResponse.json([
      { id: 101, title: 'Learn React', description: 'desc', status: 0, priority: 1, order: 0, assigneeId: null, assigneeName: null, dueDate: null, totalHours: 0 },
      { id: 102, title: 'NodeJS Backend', description: 'API', status: 1, priority: 2, order: 1, assigneeId: 2, assigneeName: 'Alice', dueDate: null, totalHours: 0 }
    ]);
  }),
  http.get('*/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Test User', email: 'test@test.com' },
      { id: 2, name: 'Alice', email: 'alice@test.com' }
    ]);
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  cleanup();
});
afterAll(() => server.close());

describe('Integration Tests - Edge Cases & UI Integrity', () => {
  
  it('1. Registration Validation - Display Server Errors', async () => {
    const user = userEvent.setup();
    localStorage.clear();
    
    server.use(
      http.post('*/api/auth/register', () => {
        return HttpResponse.json({ message: 'Email already exists' }, { status: 400 });
      })
    );

    window.history.pushState({}, 'Registration', '/register');
    render(<App />);

    expect(await screen.findByRole('button', { name: /Sign Up/i })).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/Full Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passInput = screen.getByPlaceholderText(/Password/i);
    const registerBtn = screen.getByRole('button', { name: /Sign Up/i });

    await user.type(nameInput, 'New User');
    await user.type(emailInput, 'existing@test.com');
    await user.type(passInput, 'SafePass123!');
    
    await user.click(registerBtn);

    expect(await screen.findByText(/Email already exists/i)).toBeInTheDocument();
  });

  it('2. Route Protection - Redirects unauthenticated users to login', async () => {
    localStorage.clear();
    // User tries to navigate directly to reports without token
    window.history.pushState({}, 'Reports', '/reports/time');
    
    // AuthProvider will see no token and redirect
    render(<App />);

    // Validate that it forced us to the Login page
    expect(await screen.findByRole('heading', { name: /VibeFlow/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  it('3. Error Handling - Task Creation 500 Error feedback', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', FAKE_TOKEN);

    // Inject a special failing handler just for this test
    server.use(
      http.post('*/api/tasks', () => {
        return HttpResponse.json('Server Capacity Exhausted', { status: 500 });
      })
    );
    
    // For JS alerts, we spy on window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    window.history.pushState({}, 'Dashboard', '/');
    render(<App />);
    
    await screen.findByText('Learn React');

    const addTaskButtons = await screen.findAllByRole('button', { name: /Add Task/i });
    await user.click(addTaskButtons[0]);

    const input = await screen.findByPlaceholderText(/Task title/i);
    await user.type(input, 'This will fail');
    await user.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('Server Capacity Exhausted');
    });
    
    alertMock.mockRestore();
  });

  it('4. Frontend Filtering - Search Contextualization', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', FAKE_TOKEN);
    window.history.pushState({}, 'Dashboard', '/');
    render(<App />);

    // Wait for both tasks from the mock to appear
    expect(await screen.findByText('Learn React')).toBeInTheDocument();
    expect(await screen.findByText('NodeJS Backend')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search tasks/i);
    await user.type(searchInput, 'NodeJS');

    // NodeJS should stay, Learn React should vanish
    await waitFor(() => {
      expect(screen.queryByText('Learn React')).not.toBeInTheDocument();
      expect(screen.getByText('NodeJS Backend')).toBeInTheDocument();
    });
  });

  it('5. Frontend Filtering - Assignee Dropdown Context', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', FAKE_TOKEN);
    window.history.pushState({}, 'Dashboard', '/');
    render(<App />);

    expect(await screen.findByText('Learn React')).toBeInTheDocument(); // Unassigned
    expect(await screen.findByText('NodeJS Backend')).toBeInTheDocument(); // Alice

    // Trigger select dropdown for assignee filter
    // Select element might not have a strong role if natively rendered, but we can query by value or role
    const assigneeSelect = screen.getAllByRole('combobox')[1]; 
    // Usually the second combobox in the Navbar is assignee (first is status).
    // Let's fire a change event
    await user.selectOptions(assigneeSelect, 'unassigned');

    await waitFor(() => {
      // Alice's task should vanish, Unassigned task should stay
      expect(screen.queryByText('NodeJS Backend')).not.toBeInTheDocument();
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });
  });
});
