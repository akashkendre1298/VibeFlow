import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Board from '../pages/Board';
import { BrowserRouter } from 'react-router-dom';

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Admin', email: 'admin@test.com' },
    logout: vi.fn(),
  }),
}));

// Mock dnd-kit with named exports
vi.mock('@dnd-kit/core', () => {
  return {
    DndContext: ({ children }) => <div>{children}</div>,
    useSensor: vi.fn(),
    useSensors: vi.fn(() => []),
    PointerSensor: class {},
    KeyboardSensor: class {},
    closestCorners: vi.fn(),
    defaultDropAnimationSideEffects: vi.fn(),
  };
});

vi.mock('@dnd-kit/sortable', () => {
  return {
    SortableContext: ({ children }) => <div>{children}</div>,
    verticalListSortingStrategy: {},
    useSortable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: () => {},
      transform: null,
      transition: null,
      isDragging: false,
    }),
    arrayMove: vi.fn(),
  };
});

// Mock API
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn((url) => {
      if (url === '/tasks') {
        return Promise.resolve({
          data: [
            { id: 1, title: 'Task 1', status: 'Backlog', assigneeName: 'Unassigned', createdByEmail: 'admin@test.com' }
          ]
        });
      }
      if (url === '/users') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('not found'));
    }),
  },
}));

describe('Board Page', () => {
  it('renders columns and tasks', async () => {
    render(
      <BrowserRouter>
        <Board />
      </BrowserRouter>
    );

    // Use findByText to wait for the async fetch
    const columnHeader = await screen.findByText('Backlog');
    expect(columnHeader).toBeInTheDocument();
    
    const taskTitle = await screen.findByText('Task 1');
    expect(taskTitle).toBeInTheDocument();
  });
});
