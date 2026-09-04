import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext.jsx';
import AuthPage from './features/auth/AuthPage.jsx';
import ProtectedRoute from './features/auth/ProtectedRoute.jsx';
import ComplaintPage from './features/complaints/ComplaintPage.jsx';
import ComplaintDetail from './features/complaints/ComplaintDetail.jsx';
import ServiceRequestPage from './features/serviceRequests/ServiceRequestPage.jsx';
import ServiceRequestDetail from './features/serviceRequests/ServiceRequestDetail.jsx';
import StudentDashboard from './features/dashboard/StudentDashboard.jsx';
import AdminDashboard from './features/dashboard/AdminDashboard.jsx';
import AdminPage from './features/admin/AdminPage.jsx';
import AdminRecords from './features/admin/AdminRecords.jsx';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage.jsx';
import AppShell from './components/AppShell.jsx';
import PublicShell from './components/PublicShell.jsx';
import PageHeader from './components/PageHeader.jsx';

function HomePage() {
  const { user, logout } = useAuth();

  return (
    <main className="welcome-page">
      <div className="welcome-hero"><div><p className="eyebrow">Student support workspace</p><h1>Everything you need,<br /><em>in one place.</em></h1><p className="intro">A clearer way to raise concerns, request help, and keep moving forward.</p></div><div className="hero-orbit"><span className="orbit-center">S</span><span className="orbit-chip chip-one">Complaints</span><span className="orbit-chip chip-two">Requests</span><span className="orbit-chip chip-three">Support</span></div></div>
      {user ? (
        <>
          <nav className="home-nav welcome-actions">
            {user.role === 'STUDENT' && <><Link className="button" to="/dashboard">Open dashboard <span>↗</span></Link><Link className="button button-light" to="/complaints">View complaints</Link></>}
            {user.role === 'ADMIN' && <><Link className="button" to="/admin/analytics">Open analytics <span>↗</span></Link><Link className="button button-light" to="/admin/records">Manage cases</Link></>}
            <button className="text-button" onClick={logout}>Sign out</button>
          </nav>
        </>
      ) : (
        <p className="welcome-actions"><Link className="button" to="/login">Sign in <span>↗</span></Link> <Link className="button button-light" to="/register">Create account</Link></p>
      )}
    </main>
  );
}

function HealthPage() {
  return (
    <main className="panel-page"><PageHeader eyebrow="System status" title="Everything is online." description="The API health route is available and responding." />
      <Link className="text-link" to="/">Back home</Link>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicShell />}><Route path="/login" element={<AuthPage />} /><Route path="/register" element={<AuthPage mode="register" />} /><Route path="/forgot-password" element={<ForgotPasswordPage />} /></Route>
        <Route path="/" element={<HomePage />} /><Route path="/health" element={<HealthPage />} />
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}><Route path="/account" element={<HomePage />} /><Route path="/complaints" element={<ProtectedRoute roles={['STUDENT']}><ComplaintPage /></ProtectedRoute>} /><Route path="/complaints/:id" element={<ProtectedRoute roles={['STUDENT']}><ComplaintDetail /></ProtectedRoute>} /><Route path="/service-requests" element={<ProtectedRoute roles={['STUDENT']}><ServiceRequestPage /></ProtectedRoute>} /><Route path="/service-requests/:id" element={<ProtectedRoute roles={['STUDENT']}><ServiceRequestDetail /></ProtectedRoute>} /><Route path="/dashboard" element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} /><Route path="/admin/analytics" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} /><Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} /><Route path="/admin/records" element={<ProtectedRoute roles={['ADMIN']}><AdminRecords /></ProtectedRoute>} /></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
