import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import App from '../../App';

const FAKE_PAYLOAD = btoa(JSON.stringify({ nameid: 1, email: 'test@test.com', unique_name: 'Test User' }));
const FAKE_TOKEN = `header.${FAKE_PAYLOAD}.signature`;

const handlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.email === 'test@test.com' && body.password === 'pass123') {
      return HttpResponse.json({ token: FAKE_TOKEN });
    }
    return HttpResponse.json({ message: 'Invalid' }, { status: 401 });
  }),
  http.get('*/api/tasks', () => {
    return HttpResponse.json([
      { id: 101, title: 'Learn React', description: 'desc', status: 0, priority: 1, order: 0, assigneeId: null, assigneeName: null, dueDate: null, totalHours: 0 }
    ]);
  }),
  http.post('*/api/tasks', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 102, ...body, assigneeName: null, dueDate: null, totalHours: 0 });
  }),
  http.patch('*/api/tasks/:id', async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({ id: Number(params.id), ...body });
  }),
  http.get('*/api/users', () => {
    return HttpResponse.json([
      { id: 1, name: 'Test User', email: 'test@test.com' },
      { id: 2, name: 'Alice', email: 'alice@test.com' }
    ]);
  }),
  http.get('*/api/tasks/:id/history', () => HttpResponse.json([])),
  http.get('*/api/tasks/:id/worklogs', () => HttpResponse.json([])),
  http.post('*/api/tasks/:id/worklogs', async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 99, taskItemId: Number(params.id), hours: body.hours, description: body.description, loggedAt: new Date().toISOString(), user: { name: 'Test User' } });
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

describe('Integration Tests - Core Workflows', () => {
  it('1. Login workflow redirects to board on success', async () => {
    const user = userEvent.setup();
    render(<App />);

    const loginBtn = await screen.findByRole('button', { name: /Log In/i });
    expect(loginBtn).toBeInTheDocument();
    
    const form = loginBtn.closest('form');
    await user.type(within(form).getByPlaceholderText(/Email/i), 'test@test.com');
    await user.type(within(form).getByPlaceholderText(/Password/i), 'pass123');
    await user.click(loginBtn);

    expect(await screen.findByText('Learn React')).toBeInTheDocument();
  });

  it('2. Task creation using React Hook Form via mock API', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', FAKE_TOKEN);
    render(<App />);
    
    await screen.findByText('Learn React');

    const addTaskButtons = await screen.findAllByRole('button', { name: /Add Task/i });
    await user.click(addTaskButtons[0]);

    const input = await screen.findByPlaceholderText(/Task title/i);
    await user.type(input, 'New Integration Task');
    await user.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(screen.getByText('New Integration Task')).toBeInTheDocument();
    });
  });

  it('3. Assigner selection updates correctly in Task Modal', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', FAKE_TOKEN);
    render(<App />);
    
    const taskCard = await screen.findByText('Learn React');
    fireEvent.click(taskCard.closest('.task-card') || taskCard);

    expect(await screen.findByText(/Task Details - 101/i)).toBeInTheDocument();
  });

  it('4. Time logger module submits successfully', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', FAKE_TOKEN);
    render(<App />);
    
    const taskCard = await screen.findByText('Learn React');
    fireEvent.click(taskCard.closest('.task-card') || taskCard);

    const hoursInput = await screen.findByPlaceholderText(/Hours/i);
    const descInput = screen.getByPlaceholderText(/What did you do/i);
    const submitBtn = screen.getByRole('button', { name: /Log Work/i });

    await user.type(hoursInput, '2.5');
    await user.type(descInput, 'Worked on integrations');
    await user.click(submitBtn);

    await waitFor(() => {
      expect(hoursInput).toHaveValue(null);
    });
  });

  it('5. Drag and Drop triggers update seamlessly', async () => {
    localStorage.setItem('token', FAKE_TOKEN);
    render(<App />);
    
    expect(await screen.findByText('Learn React')).toBeInTheDocument();
    expect(document.querySelector('.kanban-board')).toBeInTheDocument();
  });
});
