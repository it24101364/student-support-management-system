import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getComplaint } from './complaints.api.js';

export default function ComplaintDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: '', complaint: null });

  useEffect(() => {
    getComplaint(id)
      .then((complaint) => setState({ loading: false, error: '', complaint }))
      .catch((error) => setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to load complaint', complaint: null }));
  }, [id]);

  if (state.loading) return <main className="shell"><p className="intro">Loading complaint...</p></main>;
  if (state.error) return <main className="shell"><p className="form-error" role="alert">{state.error}</p><Link className="text-link" to="/complaints">Back to complaints</Link></main>;

  const { complaint } = state;
  return <main className="shell feature-shell"><Link className="text-link" to="/complaints">Back to complaints</Link><p className="eyebrow">{complaint.complaintNumber}</p><h1>{complaint.title}</h1><p className="intro">{complaint.description}</p><p>{complaint.category} · {complaint.priority} · <strong className={`status status-${complaint.status.toLowerCase()}`}>{complaint.status === 'REJECTED' && '🚩 '}{complaint.status.replace('_', ' ')}</strong></p>{complaint.adminReply && <p className="admin-reply"><strong>Admin reply:</strong> {complaint.adminReply}</p>}</main>;
}
