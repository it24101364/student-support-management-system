import { useState } from 'react';
import { createComplaint } from './complaints.api.js';

const categories = ['Academic', 'Hostel', 'IT Support', 'Library', 'Finance', 'Facilities', 'Other'];
const priorities = ['Low', 'Medium', 'High'];

export default function ComplaintForm() {
  const [form, setForm] = useState({ title: '', category: 'Academic', description: '', priority: 'Medium' });
  const [state, setState] = useState({ loading: false, error: '', success: '' });

  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }

  async function submit(event) {
    event.preventDefault();
    setState({ loading: true, error: '', success: '' });
    try {
      const complaint = await createComplaint(form);
      setForm({ title: '', category: 'Academic', description: '', priority: 'Medium' });
      setState({ loading: false, error: '', success: `Complaint ${complaint.complaintNumber} submitted` });
    } catch (error) {
      setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to submit complaint', success: '' });
    }
  }

  return (
    <form className="feature-form" onSubmit={submit}>
      <h2>Submit a complaint</h2>
      <input name="title" placeholder="Short title" value={form.title} onChange={update} required maxLength={160} />
      <select name="category" value={form.category} onChange={update}>{categories.map((category) => <option key={category}>{category}</option>)}</select>
      <select name="priority" value={form.priority} onChange={update}>{priorities.map((priority) => <option key={priority}>{priority}</option>)}</select>
      <textarea name="description" placeholder="Describe what happened" value={form.description} onChange={update} required maxLength={5000} rows={6} />
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      {state.success && <p className="form-success" role="status">{state.success}</p>}
      <button className="button" disabled={state.loading}>{state.loading ? 'Submitting...' : 'Submit complaint'}</button>
    </form>
  );
}
