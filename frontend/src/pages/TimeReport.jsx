import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

const TimeReport = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const res = await api.get('/reports/time');
      setReport(res.data);
    };
    fetchReport();
  }, []);

  if (!report) return <div>Loading...</div>;

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ padding: '40px', overflowY: 'auto' }}>
          <h1 style={{ marginBottom: '30px', fontSize: '24px', fontWeight: 600 }}>Time Report</h1>
          
          <div style={{ background: 'var(--surface-container)', borderRadius: 'var(--radius-md)', border: '1px solid var(--outline-variant)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--surface-container-high)', borderBottom: '1px solid var(--outline-variant)' }}>
                  <th style={{ padding: '15px', color: 'var(--on-surface-variant)', fontSize: '12px', textTransform: 'uppercase' }}>Task Title</th>
                  <th style={{ padding: '15px', color: 'var(--on-surface-variant)', fontSize: '12px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '15px', color: 'var(--on-surface-variant)', fontSize: '12px', textTransform: 'uppercase' }}>Assignee</th>
                  <th style={{ padding: '15px', textAlign: 'right', color: 'var(--on-surface-variant)', fontSize: '12px', textTransform: 'uppercase' }}>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {report.tasks.map(task => (
                  <tr key={task.taskId} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{task.title}</td>
                    <td style={{ padding: '15px' }}>
                      <span className="badge badge-blue">{task.status}</span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{task.assigneeName}</td>
                    <td style={{ padding: '15px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary)', fontSize: '14px' }}>{task.totalHours.toFixed(1)}h</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--surface-container-high)', fontWeight: 'bold' }}>
                  <td colSpan="3" style={{ padding: '15px', textAlign: 'right', fontSize: '14px' }}>Project Grand Total:</td>
                  <td style={{ padding: '15px', textAlign: 'right', fontSize: '18px', color: 'var(--primary)' }}>
                    {report.grandTotalHours.toFixed(1)}h
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeReport;
