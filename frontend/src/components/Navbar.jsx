import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Search, LogOut, BarChart2, Filter, Menu } from 'lucide-react';

const Navbar = ({
  searchTerm, setSearchTerm,
  statusFilter, setStatusFilter,
  assigneeFilter, setAssigneeFilter,
  users = [],
  onMenuClick
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '24px'
    }}>
      {/* Left: Hamburger (Mobile) & Search & Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        <button
          className="mobile-only"
          onClick={onMenuClick}
          style={{ background: 'none', border: 'none', color: 'var(--on-surface)', cursor: 'pointer' }}
        >
          <Menu size={24} />
        </button>
        {setSearchTerm && (
          <div style={{ position: 'relative', maxWidth: '300px', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--on-surface-variant)' }} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 40px',
                background: 'var(--surface-container-high)',
                border: '1px solid var(--outline-variant)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--on-surface)',
                fontSize: '14px'
              }}
            />
          </div>
        )}

        {setStatusFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--on-surface-variant)" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Status</option>
              <option value="0">Backlog</option>
              <option value="1">To Do</option>
              <option value="2">In Progress</option>
              <option value="3">Review</option>
              <option value="4">QA</option>
              <option value="5">Done</option>
              <option value="6">On Hold</option>
              <option value="7">Cancelled</option>
            </select>

            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="all">All Assignees</option>
              <option value="unassigned">Unassigned</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Reports & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link to="/reports/time" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(87, 157, 255, 0.1)',
          color: 'var(--primary)',
          textDecoration: 'none'
        }} title="Reports">
          <BarChart2 size={18} />
          <span className="desktop-only">Reports</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '12px', borderLeft: '1px solid var(--outline-variant)' }}>
          <div className="desktop-only" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)' }}>{user?.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(245, 34, 45, 0.1)',
              color: '#f5222d',
              border: 'none',
              padding: '8px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex'
            }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const selectStyle = {
  padding: '8px 12px',
  background: 'var(--surface-container-high)',
  border: '1px solid var(--outline-variant)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--on-surface)',
  fontSize: '14px',
  cursor: 'pointer'
};

export default Navbar;
