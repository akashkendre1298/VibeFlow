import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, User } from 'lucide-react';

const TaskCard = ({ task, onClick, isOverlay }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, disabled: isOverlay });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isOverlay ? undefined : transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: isOverlay ? 'grabbing' : 'grab',
    pointerEvents: isOverlay ? 'none' : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="task-card"
      onClick={() => onClick(task)}
    >
      <div className="task-title">{task.title}</div>
      <div style={{ marginBottom: '12px', fontSize: '12px', color: 'var(--on-surface-variant)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {task.description}
      </div>
      <div className="task-footer" style={{ borderTop: '1px solid var(--outline-variant)', paddingTop: '10px', marginTop: '10px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
              <User size={12} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 500 }}>{task.assignee ? task.assignee.name : 'Unassigned'}</span>
            </div>
            <div style={{ 
              padding: '2px 8px', 
              borderRadius: '2px', 
              fontSize: '9px', 
              fontWeight: 800, 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              background: task.priority === 3 ? '#f5222d' : (task.priority === 2 ? '#fa8c16' : (task.priority === 0 ? '#52c41a' : '#1890ff')),
              color: '#fff'
            }}>
              {['Low', 'Med', 'High', 'Urgent'][task.priority]}
            </div>
          </div>
          
          {task.dueDate && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              fontSize: '11px', 
              color: new Date(task.dueDate) < new Date() ? '#f5222d' : 'var(--on-surface-variant)'
            }}>
              <Calendar size={12} />
              <span>Due: {task.dueDate.split('T')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
