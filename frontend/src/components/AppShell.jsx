import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext.jsx';

const studentLinks = [
  { to: '/dashboard', label: 'Overview', icon: '⌂' },
  { to: '/complaints', label: 'Complaints', icon: '!' },
  { to: '/service-requests', label: 'Service requests', icon: '↗' }
];

const adminLinks = [
  { to: '/admin/analytics', label: 'Analytics', icon: '◒' },
  { to: '/admin/records', label: 'Case management', icon: '▤' },
  { to: '/admin/users', label: 'Users', icon: '♙' }
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

  return <div className="app-frame"><aside className="sidebar"><Link className="brand" to="/"><span className="brand-mark">S</span><span>Student<span className="brand-muted">Support</span></span></Link><div className="workspace-label">Workspace</div><nav className="side-nav">{links.map((link) => <NavLink className={({ isActive }) => isActive ? 'side-link active' : 'side-link'} to={link.to} key={link.to}><span className="nav-icon">{link.icon}</span>{link.label}</NavLink>)}</nav><div className="sidebar-bottom"><div className="help-card"><span className="help-dot">?</span><div><strong>Need a hand?</strong><small>Contact student support</small></div></div><button className="side-logout" onClick={logout}><span>↪</span> Sign out</button></div></aside><div className="main-column"><header className="topbar"><div className="mobile-brand"><span className="brand-mark">S</span> StudentSupport</div><div className="topbar-actions"><div className="profile"><span className="avatar">{user?.name?.charAt(0).toUpperCase()}</span><span className="profile-copy"><strong>{user?.name}</strong><small>{user?.role === 'ADMIN' ? 'Administrator' : 'Student'}</small></span><span className="chevron">⌄</span></div></div></header><main className="content"><Outlet /></main></div></div>;
}
