import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteComplaint, getMyComplaints } from './complaints.api.js';

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    getMyComplaints().then(setComplaints).catch((error) => setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to load complaints' })).finally(() => setState((current) => ({ ...current, loading: false })));
  }, []);

  async function remove(id) {
    if (!window.confirm('Delete this pending complaint?')) return;
    await deleteComplaint(id);
    setComplaints((current) => current.filter((complaint) => complaint._id !== id));
  }

  if (state.loading) return <p className="intro">Loading complaints...</p>;
  if (state.error) return <p className="form-error" role="alert">{state.error}</p>;
  if (!complaints.length) return <p className="intro">No complaints submitted yet.</p>;

  return <div className="item-list">{complaints.map((complaint) => <article className="item" key={complaint._id}>
    <div><p className="eyebrow">{complaint.complaintNumber}</p><h3>{complaint.title}</h3><p>{complaint.category} · {complaint.priority}</p></div>
    <div><strong className={`status status-${complaint.status.toLowerCase()}`}>{complaint.status === 'REJECTED' && '🚩 '}{complaint.status.replace('_', ' ')}</strong>{complaint.adminReply && <p className="admin-reply">Admin reply: {complaint.adminReply}</p>}<p><Link className="text-link" to={`/complaints/${complaint._id}`}>View</Link> {complaint.status === 'PENDING' && <button className="link-button" onClick={() => remove(complaint._id)}>Delete</button>}</p></div>
  </article>)}</div>;
}
