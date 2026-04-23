import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const Column = ({ id, title, tasks, onTaskClick, onAddTask, showAddButton, users }) => {
  const numericId = parseInt(id.toString().replace('column-', ''));
  const { setNodeRef } = useDroppable({ id });
  const [isAdding, setIsAdding] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState(1); // Default Medium
  const [status, setStatus] = React.useState(numericId);
  const [assigneeId, setAssigneeId] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    onAddTask({ 
      title: newTitle, 
      status: parseInt(status),
      description,
      priority: parseInt(priority),
      assigneeId: assigneeId ? parseInt(assigneeId) : null,
      dueDate: dueDate || null
    });
    setNewTitle('');
    setDescription('');
    setPriority(1);
    setAssigneeId('');
    setDueDate('');
    setIsAdding(false);
  };

  return (
    <div className="column">
      <div className="column-header">
        <span>{title}</span>
        <span style={{ background: 'var(--surface-container-highest)', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', color: 'var(--on-surface)' }}>
          {tasks.length}
        </span>
      </div>
      <div ref={setNodeRef} className="column-tasks">
        {showAddButton && !isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px', 
              width: '100%', 
              background: 'none', 
              color: 'var(--on-surface-variant)',
              fontSize: '14px',
              textAlign: 'left',
              marginBottom: '12px'
            }}
          >
            <Plus size={16} /> Add Task
          </button>
        )}

        {isAdding && (
          <form onSubmit={handleSubmit} style={{ padding: '8px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', marginBottom: '16px' }}>
            <input 
              autoFocus
              placeholder="Task title" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <textarea 
              placeholder="Description (optional)" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              style={{ 
                width: '100%', 
                minHeight: '60px',
                padding: '8px', 
                borderRadius: 'var(--radius-md)', 
                background: 'var(--surface-container-high)', 
                color: 'var(--on-surface)',
                border: '1px solid var(--outline-variant)',
                fontSize: '12px',
                marginBottom: '8px',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Priority</label>
                <select 
                  value={priority} 
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--surface-container-high)', 
                    color: 'var(--on-surface)',
                    border: '1px solid var(--outline-variant)',
                    fontSize: '12px'
                  }}
                >
                  <option value={0}>Low</option>
                  <option value={1}>Medium</option>
                  <option value={2}>High</option>
                  <option value={3}>Urgent</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    borderRadius: 'var(--radius-md)', 
                    background: 'var(--surface-container-high)', 
                    color: 'var(--on-surface)',
                    border: '1px solid var(--outline-variant)',
                    fontSize: '12px'
                  }}
                >
                  <option value={0}>Backlog</option>
                  <option value={1}>To Do</option>
                  <option value={2}>In Progress</option>
                  <option value={3}>Review</option>
                  <option value={4}>QA</option>
                  <option value={5}>Done</option>
                  <option value={6}>On Hold</option>
                  <option value={7}>Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Due Date</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)}
                style={{ padding: '8px', fontSize: '12px', width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--on-surface-variant)', display: 'block', marginBottom: '4px' }}>Assign To</label>
              <select 
                value={assigneeId} 
                onChange={(e) => setAssigneeId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'var(--surface-container-high)', 
                  color: 'var(--on-surface)',
                  border: '1px solid var(--outline-variant)',
                  fontSize: '12px'
                }}
              >
                <option value="">Unassigned</option>
                {users?.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="submit" 
                className="primary" 
                disabled={!newTitle.trim()}
                style={{ 
                  padding: '8px 16px', 
                  fontSize: '12px', 
                  flex: 1,
                  opacity: !newTitle.trim() ? 0.5 : 1,
                  cursor: !newTitle.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                Create
              </button>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)} 
                style={{ background: 'transparent', color: 'var(--on-surface)', fontSize: '12px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;
