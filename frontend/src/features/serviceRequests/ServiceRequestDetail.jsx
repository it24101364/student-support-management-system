import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getServiceRequest } from './serviceRequests.api.js';

export default function ServiceRequestDetail() {
  const { id } = useParams(); const [state, setState] = useState({ loading: true, error: '', request: null });
  useEffect(() => { getServiceRequest(id).then((request) => setState({ loading: false, error: '', request })).catch((error) => setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to load request', request: null })); }, [id]);
  if (state.loading) return <main className="shell"><p className="intro">Loading request...</p></main>;
  if (state.error) return <main className="shell"><p className="form-error" role="alert">{state.error}</p><Link className="text-link" to="/service-requests">Back to requests</Link></main>;
  const { request } = state;
  return <main className="shell feature-shell"><Link className="text-link" to="/service-requests">Back to requests</Link><p className="eyebrow">{request.requestNumber}</p><h1>{request.title}</h1><p className="intro">{request.description}</p><p>{request.requestType} · {request.priority} · <strong className={`status status-${request.status.toLowerCase()}`}>{request.status === 'REJECTED' && '🚩 '}{request.status}</strong></p>{request.adminReply && <p className="admin-reply"><strong>Admin reply:</strong> {request.adminReply}</p>}</main>;
}
