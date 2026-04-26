import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { X, User as UserIcon, History } from 'lucide-react';

const TaskModal = ({ task, onClose, onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [logHours, setLogHours] = useState('');
  const [logDesc, setLogDesc] = useState('');

  const fetchData = async () => {
    const [uRes, hRes, wRes] = await Promise.all([
      api.get('/users'),
      api.get(`/tasks/${task.id}/history`),
      api.get(`/tasks/${task.id}/worklogs`)
    ]);
    setUsers(uRes.data);
    setHistory(hRes.data);
    setWorkLogs(wRes.data);
  };

  useEffect(() => {
    fetchData();
  }, [task.id]);

  const handleLogWork = async (e) => {
    e.preventDefault();
    if (!logHours) return;
    await api.post(`/tasks/${task.id}/worklogs`, { 
      hours: parseFloat(logHours), 
      description: logDesc 
    });
    setLogHours('');
    setLogDesc('');
    fetchData();
  };

  const handleAssigneeChange = async (userId) => {
    await api.patch(`/tasks/${task.id}`, { 
      assigneeId: userId === "null" ? null : parseInt(userId),
      clearAssignee: userId === "null"
    });
    onUpdate();
  };

  const handlePriorityChange = async (val) => {
    await api.patch(`/tasks/${task.id}`, { priority: parseInt(val) });
    onUpdate();
  };

  const handleStatusChange = async (val) => {
    await api.patch(`/tasks/${task.id}`, { status: parseInt(val) });
    onUpdate();
  };

  const handleDescriptionUpdate = async (val) => {
    await api.patch(`/tasks/${task.id}`, { description: val });
    onUpdate();
  };

  const handleDueDateChange = async (val) => {
    await api.patch(`/tasks/${task.id}`, { dueDate: val || null });
    onUpdate();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(4, 15, 28, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: 'var(--surface-container)', width: '800px', maxHeight: '90vh', borderRadius: 'var(--radius-lg)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--outline-variant)',
        boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
      }}>
        <div className="modal-header" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--outline-variant)' }}>
          <span style={{ color: 'var(--on-surface-variant)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Task Details - {task.id}</span>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--on-surface-variant)' }}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ padding: '24px', display: 'flex', gap: '32px', overflowY: 'auto' }}>
          <div style={{ flex: 2 }}>
            <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px', color: 'var(--on-surface)' }}>{task.title}</h2>
            
            <div style={{ marginBottom: '32px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Description</label>
              <textarea 
                defaultValue={task.description}
                onBlur={(e) => handleDescriptionUpdate(e.target.value)}
                placeholder="Add a description..."
                style={{ 
                  width: '100%', 
                  minHeight: '120px', 
                  padding: '12px', 
                  background: 'var(--surface-container-low)', 
                  color: 'var(--on-surface)', 
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '16px', color: 'var(--on-surface)' }}>
                <History size={18} /> Assignment History
              </div>
              <div style={{ fontSize: '13px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', padding: '0 16px', marginBottom: '32px' }}>
                {history.length > 0 ? history.map(h => (
                  <div key={h.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                    {h.oldDueDate || h.newDueDate ? (
                      !h.oldDueDate ? (
                        <>
                          <span style={{ color: 'var(--on-surface-variant)' }}>{h.changedBy?.name}</span> changed due date to <strong style={{ color: 'var(--primary)' }}>{h.newDueDate.split('T')[0]}</strong>
                        </>
                      ) : !h.newDueDate ? (
                        <>
                          <span style={{ color: 'var(--on-surface-variant)' }}>{h.changedBy?.name}</span> removed due date (previously <strong style={{ color: 'var(--primary)' }}>{h.oldDueDate.split('T')[0]}</strong>)
                        </>
                      ) : (
                        <>
                          <span style={{ color: 'var(--on-surface-variant)' }}>{h.changedBy?.name}</span> changed due date from <strong style={{ color: 'var(--primary)' }}>{h.oldDueDate.split('T')[0]}</strong> to <strong style={{ color: 'var(--primary)' }}>{h.newDueDate.split('T')[0]}</strong>
                        </>
                      )
                    ) : (
                      !h.oldAssignee ? (
                        <>
                          <span style={{ color: 'var(--on-surface-variant)' }}>{h.changedBy?.name}</span> assigned to <strong style={{ color: 'var(--primary)' }}>{h.newAssignee?.name}</strong>
                        </>
                      ) : !h.newAssignee ? (
                        <>
                          <span style={{ color: 'var(--on-surface-variant)' }}>{h.changedBy?.name}</span> unassigned (previously <strong style={{ color: 'var(--primary)' }}>{h.oldAssignee?.name}</strong>)
                        </>
                      ) : (
                        <>
                          <span style={{ color: 'var(--on-surface-variant)' }}>{h.changedBy?.name}</span> changed assignee from <strong style={{ color: 'var(--primary)' }}>{h.oldAssignee?.name}</strong> to <strong style={{ color: 'var(--primary)' }}>{h.newAssignee?.name}</strong>
                        </>
                      )
                    )}
                    <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      {new Date(h.changedAt.endsWith('Z') ? h.changedAt : h.changedAt + 'Z').toLocaleString('en-IN')}
                    </div>
                  </div>
                )) : <div style={{ padding: '16px', color: 'var(--on-surface-variant)' }}>No assignment history yet.</div>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '16px', color: 'var(--on-surface)' }}>
                <History size={18} /> Work Logs
              </div>
              <div style={{ fontSize: '13px', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', padding: '0 16px' }}>
                {workLogs.length > 0 ? workLogs.map(log => (
                  <div key={log.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--outline-variant)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--primary)' }}>{log.user?.name}</strong>
                      <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{log.hours}h</span>
                    </div>
                    <div style={{ color: 'var(--on-surface)' }}>{log.description}</div>
                    <div style={{ fontSize: '11px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                      {new Date(log.loggedAt.endsWith('Z') ? log.loggedAt : log.loggedAt + 'Z').toLocaleString('en-IN')}
                    </div>
                  </div>
                )) : <div style={{ padding: '16px', color: 'var(--on-surface-variant)' }}>No work logged yet.</div>}
              </div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: '20px', background: 'var(--surface-container-high)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Status</label>
              <select 
                value={task.status} 
                onChange={e => handleStatusChange(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  background: 'var(--surface-container)', 
                  color: 'var(--on-surface)', 
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px'
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

            <div style={{ marginBottom: '20px', background: 'var(--surface-container-high)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Priority</label>
              <select 
                value={task.priority} 
                onChange={e => handlePriorityChange(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  background: 'var(--surface-container)', 
                  color: 'var(--on-surface)', 
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px'
                }}
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
                <option value={3}>Urgent</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px', background: 'var(--surface-container-high)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Assignee</label>
              <select 
                value={task.assigneeId || "null"} 
                onChange={e => handleAssigneeChange(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  background: 'var(--surface-container)', 
                  color: 'var(--on-surface)', 
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px'
                }}
              >
                <option value="null">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '24px', background: 'var(--surface-container-high)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Created By</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: 'var(--primary-container)', 
                  color: 'var(--on-primary)',
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {task.createdBy?.name?.charAt(0)}
                </div>
                <div style={{ color: 'var(--on-surface)' }}>{task.createdBy?.name}</div>
              </div>
            </div>

            <div style={{ background: 'var(--surface-container-high)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Due Date</label>
              <input 
                type="date" 
                defaultValue={task.dueDate ? task.dueDate.split('T')[0] : ''}
                onChange={e => handleDueDateChange(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  background: 'var(--surface-container)', 
                  color: 'var(--on-surface)', 
                  border: '1px solid var(--outline-variant)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginTop: '24px', background: 'var(--surface-container-high)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--on-surface-variant)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Log Work</label>
              <form onSubmit={handleLogWork}>
                <input 
                  type="number" 
                  step="0.5"
                  placeholder="Hours (e.g. 1.5)" 
                  value={logHours}
                  onChange={e => setLogHours(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    background: 'var(--surface-container)', 
                    color: 'var(--on-surface)', 
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}
                />
                <textarea 
                  placeholder="What did you do?" 
                  value={logDesc}
                  onChange={e => setLogDesc(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    background: 'var(--surface-container)', 
                    color: 'var(--on-surface)', 
                    border: '1px solid var(--outline-variant)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '13px',
                    marginBottom: '12px',
                    minHeight: '60px',
                    resize: 'none'
                  }}
                />
                <button 
                  type="submit"
                  disabled={!logHours}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    background: 'var(--primary)', 
                    color: 'var(--on-primary)', 
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: logHours ? 'pointer' : 'not-allowed',
                    opacity: logHours ? 1 : 0.6
                  }}
                >
                  Log Work
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
