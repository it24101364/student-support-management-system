import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminAnalytics } from './dashboard.api.js';
import Breakdown from './Breakdown.jsx';
import MetricCard from './MetricCard.jsx';

export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: '', data: null });
  useEffect(() => { getAdminAnalytics().then((data) => setState({ loading: false, error: '', data })).catch((error) => setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to load analytics', data: null })); }, []);
  if (state.loading) return <main className="shell"><p className="intro">Loading system analytics...</p></main>;
  if (state.error) return <main className="shell"><p className="form-error" role="alert">{state.error}</p></main>;
  const { complaints, serviceRequests } = state.data;
  return <main className="shell feature-shell"><Link className="text-link" to="/">Back home</Link><p className="eyebrow">Admin analytics</p><h1>See the whole system.</h1><div className="metric-grid"><MetricCard label="Total complaints" value={complaints.total} /><MetricCard label="Total service requests" value={serviceRequests.total} /></div><div className="dashboard-grid"><Breakdown title="Complaints by status" values={complaints.byStatus} /><Breakdown title="Complaints by category" values={complaints.byCategory} /><Breakdown title="Complaints by priority" values={complaints.byPriority} /><Breakdown title="Requests by status" values={serviceRequests.byStatus} /><Breakdown title="Requests by type" values={serviceRequests.byType} /></div></main>;
}
