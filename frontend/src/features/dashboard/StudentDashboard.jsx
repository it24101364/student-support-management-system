import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStudentAnalytics } from './dashboard.api.js';
import Breakdown from './Breakdown.jsx';
import MetricCard from './MetricCard.jsx';

export default function StudentDashboard() {
  const [state, setState] = useState({ loading: true, error: '', data: null });
  useEffect(() => { getStudentAnalytics().then((data) => setState({ loading: false, error: '', data })).catch((error) => setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to load dashboard', data: null })); }, []);
  if (state.loading) return <main className="shell"><p className="intro">Loading your dashboard...</p></main>;
  if (state.error) return <main className="shell"><p className="form-error" role="alert">{state.error}</p></main>;
  const { complaints, serviceRequests } = state.data;
  return <main className="shell feature-shell"><Link className="text-link" to="/">Back home</Link><p className="eyebrow">Student dashboard</p><h1>Your support overview.</h1><div className="metric-grid"><MetricCard label="Complaints" value={complaints.total} /><MetricCard label="Service requests" value={serviceRequests.total} /></div><div className="dashboard-grid"><Breakdown title="Complaint status" values={complaints.byStatus} /><Breakdown title="Request status" values={serviceRequests.byStatus} /></div></main>;
}
