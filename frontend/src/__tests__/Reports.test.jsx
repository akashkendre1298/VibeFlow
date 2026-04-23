import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Reports from '../pages/Reports';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Admin', email: 'admin@test.com' },
    logout: vi.fn(),
  }),
}));

// Mock API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn((url) => {
      if (url === '/reports/time') {
        return Promise.resolve({
          data: {
            tasks: [
              { taskId: 1, title: 'Task 1', status: 'Done', assigneeName: 'Alice', totalHours: 5.5 },
              { taskId: 2, title: 'Task 2', status: 'InProgress', assigneeName: 'Bob', totalHours: 2.5 }
            ],
            userReports: [
              { userName: 'Alice', totalHours: 5.5 },
              { userName: 'Bob', totalHours: 2.5 }
            ],
            grandTotalHours: 8.0
          }
        });
      }
      if (url === '/users') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('not found'));
    }),
  },
}));

describe('Reports Page', () => {
  it('renders total hours correctly', async () => {
    render(
      <BrowserRouter>
        <Reports />
      </BrowserRouter>
    );

    // Using findAllByText in case of duplicates, and checking the first one
    const elements = await screen.findAllByText('8.0h');
    expect(elements[0]).toBeInTheDocument();
  });

  it('renders task names and user names', async () => {
    render(
      <BrowserRouter>
        <Reports />
      </BrowserRouter>
    );

    // Task 1 and Task 2 should be present
    expect(await screen.findByText('Task 1')).toBeInTheDocument();
    expect(await screen.findByText('Task 2')).toBeInTheDocument();

    // Alice should be present (multiple times, so use findAll)
    const aliceElements = await screen.findAllByText('Alice');
    expect(aliceElements.length).toBeGreaterThan(0);
  });
});
