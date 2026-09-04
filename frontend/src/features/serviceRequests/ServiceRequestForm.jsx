import { useState } from 'react';
import { createServiceRequest } from './serviceRequests.api.js';

const types = ['ID Card Replacement', 'Transcript Request', 'Certificate Request', 'Hostel Maintenance', 'IT Support Request', 'Library Request', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

export default function ServiceRequestForm() {
  const [form, setForm] = useState({ requestType: types[0], title: '', description: '', priority: 'Medium' });
  const [state, setState] = useState({ loading: false, error: '', success: '' });
  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setState({ loading: true, error: '', success: '' });
    try { const request = await createServiceRequest(form); setForm({ requestType: types[0], title: '', description: '', priority: 'Medium' }); setState({ loading: false, error: '', success: `Request ${request.requestNumber} submitted` }); }
    catch (error) { setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to submit request', success: '' }); }
  }
  return <form className="feature-form" onSubmit={submit}><h2>Request a service</h2><select name="requestType" value={form.requestType} onChange={update}>{types.map((type) => <option key={type}>{type}</option>)}</select><input name="title" placeholder="Short title" value={form.title} onChange={update} required maxLength={160} /><select name="priority" value={form.priority} onChange={update}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select><textarea name="description" placeholder="Describe what you need" value={form.description} onChange={update} required maxLength={5000} rows={6} />{state.error && <p className="form-error" role="alert">{state.error}</p>}{state.success && <p className="form-success" role="status">{state.success}</p>}<button className="button" disabled={state.loading}>{state.loading ? 'Submitting...' : 'Submit request'}</button></form>;
}
