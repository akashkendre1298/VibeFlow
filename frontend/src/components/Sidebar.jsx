import { Link, useLocation } from 'react-router-dom';
import { Layout, Users, Calendar, Settings, BarChart2, X } from 'lucide-react';

const Sidebar = ({
  isOpen, onClose,
  statusFilter, setStatusFilter,
  assigneeFilter, setAssigneeFilter,
  users = []
}) => {
  const location = useLocation();

  const menuItems = [
    { icon: <Layout size={18} />, label: 'Board', path: '/', active: location.pathname === '/' },
    { icon: <Users size={18} />, label: 'Team', path: '/team', active: location.pathname === '/team' },
    { icon: <BarChart2 size={18} />, label: 'Reports', path: '/reports/time', active: location.pathname === '/reports/time' },

  ];

  const selectStyle = {
    width: '100%',
    padding: '10px 12px',
    background: 'var(--surface-container-high)',
    border: '1px solid var(--outline-variant)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--on-surface)',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px'
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-inner" style={{ position: 'relative', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div className="navbar-brand">VibeFlow</div>
          <button className="mobile-only" onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'var(--on-surface-variant)',
            cursor: 'pointer'
          }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="menu-item"
              onClick={() => { if (window.innerWidth <= 768) onClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                cursor: 'pointer',
                color: item.active ? 'var(--primary)' : 'var(--on-surface-variant)',
                background: item.active ? 'rgba(87, 157, 255, 0.1)' : 'transparent',
                borderLeft: item.active ? '2px solid var(--primary)' : 'none'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile-only Filters */}
        {setStatusFilter && (
          <div className="mobile-only" style={{ flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--outline-variant)', paddingTop: '20px', marginTop: 'auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filters</div>

            <div>
              <div style={{ fontSize: '13px', color: 'var(--on-surface)', marginBottom: '4px' }}>Status</div>
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
            </div>

            <div>
              <div style={{ fontSize: '13px', color: 'var(--on-surface)', marginBottom: '4px' }}>Assignee</div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
