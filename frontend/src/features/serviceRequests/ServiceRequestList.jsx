import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteServiceRequest, getMyServiceRequests } from './serviceRequests.api.js';

export default function ServiceRequestList() {
  const [requests, setRequests] = useState([]); const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => { getMyServiceRequests().then(setRequests).catch((error) => setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to load service requests' })).finally(() => setState((current) => ({ ...current, loading: false }))); }, []);
  async function remove(id) { if (!window.confirm('Delete this submitted request?')) return; await deleteServiceRequest(id); setRequests((current) => current.filter((request) => request._id !== id)); }
  if (state.loading) return <p className="intro">Loading service requests...</p>;
  if (state.error) return <p className="form-error" role="alert">{state.error}</p>;
  if (!requests.length) return <p className="intro">No service requests submitted yet.</p>;
  return <div className="item-list">{requests.map((request) => <article className="item" key={request._id}><div><p className="eyebrow">{request.requestNumber}</p><h3>{request.title}</h3><p>{request.requestType} · {request.priority}</p></div><div><strong className={`status status-${request.status.toLowerCase()}`}>{request.status === 'REJECTED' && '🚩 '}{request.status}</strong>{request.adminReply && <p className="admin-reply">Admin reply: {request.adminReply}</p>}<p><Link className="text-link" to={`/service-requests/${request._id}`}>View</Link> {request.status === 'SUBMITTED' && <button className="link-button" onClick={() => remove(request._id)}>Delete</button>}</p></div></article>)}</div>;
}
