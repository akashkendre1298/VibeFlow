import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

const getStatusId = (status) => {
  const map = {
    'Backlog': 0, 'ToDo': 1, 'InProgress': 2, 'Review': 3,
    'QA': 4, 'Done': 5, 'OnHold': 6, 'Cancelled': 7
  };
  return map[status] ?? -1;
};

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, usersRes] = await Promise.all([
          api.get('/reports/time'),
          api.get('/users')
        ]);
        setReportData(reportRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTasks = React.useMemo(() => {
    if (!reportData?.tasks) return [];
    return reportData.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || getStatusId(task.status).toString() === statusFilter;
      const matchesAssignee = assigneeFilter === 'all' ||
        (assigneeFilter === 'unassigned' && task.assigneeName === 'Unassigned') ||
        (users.find(u => u.id.toString() === assigneeFilter)?.name === task.assigneeName);
      return matchesSearch && matchesStatus && matchesAssignee;
    });
  }, [reportData, searchTerm, statusFilter, assigneeFilter, users]);

  if (loading) return <div style={{ padding: '40px', color: 'var(--on-surface)' }}>Loading analytical reports...</div>;

  const totalHours = filteredTasks.reduce((sum, t) => sum + t.totalHours, 0);
  const completedTasks = filteredTasks.filter(t => t.status === 'Done').length;
  const avgHours = filteredTasks.length > 0 ? (totalHours / filteredTasks.length).toFixed(1) : 0;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Done': return 'status-done';
      case 'InProgress': return 'status-inprogress';
      case 'Review': return 'status-review';
      case 'QA': return 'status-qa';
      case 'Cancelled': return 'status-cancelled';
      case 'OnHold': return 'status-onhold';
      default: return 'status-default';
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
        users={users}
      />
      <div className="main-content">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          assigneeFilter={assigneeFilter}
          setAssigneeFilter={setAssigneeFilter}
          users={users}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <div className="page-content">
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '8px' }}>Project Insights</h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '15px' }}>Analyze task progress and team time allocation across the board.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div className="stat-card">
              <div className="icon-circle" style={{ background: 'rgba(87, 157, 255, 0.1)', color: 'var(--primary)' }}><Clock size={24} /></div>
              <div>
                <div className="stat-label">Total Hours Spent</div>
                <div className="stat-value">{totalHours}h</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-circle" style={{ background: 'rgba(56, 182, 122, 0.1)', color: '#38b27a' }}><CheckCircle2 size={24} /></div>
              <div>
                <div className="stat-label">Tasks Completed</div>
                <div className="stat-value">{completedTasks}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-circle" style={{ background: 'rgba(255, 159, 67, 0.1)', color: '#ff9f43' }}><TrendingUp size={24} /></div>
              <div>
                <div className="stat-label">Avg. Hours / Task</div>
                <div className="stat-value">{avgHours}h</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="icon-circle" style={{ background: 'rgba(162, 155, 254, 0.1)', color: '#a29bfe' }}><AlertCircle size={24} /></div>
              <div>
                <div className="stat-label">Total Tasks</div>
                <div className="stat-value">{filteredTasks.length}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            <div style={{
              background: 'var(--surface-container)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--outline-variant)',
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '24px' }}>Team Contribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reportData?.userReports?.filter(u => {
                  return assigneeFilter === 'all' || users.find(user => user.id.toString() === assigneeFilter)?.name === u.userName;
                }).map(user => (
                  <div key={user.userName}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span style={{ color: 'var(--on-surface)', fontWeight: 500 }}>{user.userName}</span>
                      <span style={{ color: 'var(--on-surface-variant)' }}>{user.totalHours}h</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--surface-container-high)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: 'var(--primary)',
                        width: `${Math.min((user.totalHours / (totalHours || 1)) * 100, 100)}%`,
                        borderRadius: '4px',
                        transition: 'width 1s ease-out'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'var(--surface-container)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--outline-variant)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <Clock size={48} color="var(--primary)" style={{ marginBottom: '16px', opacity: 0.8 }} />
              <h4 style={{ fontSize: '16px', color: 'var(--on-surface)', marginBottom: '8px' }}>Productivity Tip</h4>
              <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                Focus on 'Done' tasks! Currently, <strong>{completedTasks}</strong> tasks are shown in your current view,
                helping you track progress precisely.
              </p>
            </div>
          </div>


          <div style={{
            background: 'var(--surface-container)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--outline-variant)',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            marginBottom: '40px',
            flexShrink: 0
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--on-surface)' }}>Detailed Time Report (by Task)</h3>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Hours Logged</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map(t => (
                    <tr key={t.taskId} style={{ transition: 'background 0.2s' }}>
                      <td>#{t.taskId}</td>
                      <td style={{ fontWeight: 500, color: 'var(--on-surface)' }}>{t.title}</td>
                      <td>
                        <span className={`status-badge ${getStatusClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>{t.assigneeName}</td>
                      <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>{t.totalHours}h</td>
                      <td style={{ color: 'var(--on-surface-variant)' }}>{t.latestDueDate ? new Date(t.latestDueDate).toLocaleDateString('en-GB') : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{
            background: 'var(--surface-container)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--outline-variant)',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--outline-variant)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--on-surface)' }}>Recent Work Activity Log</h3>
            </div>
            <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'auto' }}>
              <table className="report-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>User</th>
                    <th>Task</th>
                    <th>Hours</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.workLogs?.filter(log => {
                    const matchesSearch = log.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      log.description.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesAssignee = assigneeFilter === 'all' ||
                      users.find(u => u.id.toString() === assigneeFilter)?.name === log.userName;
                    return matchesSearch && matchesAssignee;
                  }).map(log => (
                    <tr key={log.id}>
                      <td>{new Date(log.loggedAt).toLocaleDateString('en-GB')}</td>
                      <td style={{ fontWeight: 500 }}>{log.userName}</td>
                      <td>{log.taskTitle}</td>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{log.hours}h</td>
                      <td style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>{log.description}</td>
                    </tr>
                  ))}
                  {(!reportData?.workLogs || reportData.workLogs.length === 0) && (
                    <tr>
                      <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--on-surface-variant)' }}>No work activity found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
