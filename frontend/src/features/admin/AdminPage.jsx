import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, updateUserStatus } from './admin.api.js';

export default function AdminPage() {
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [state, setState] = useState({ loading: true, error: '', data: { users: [], pagination: {} } });
  const [message, setMessage] = useState('');

  async function loadUsers(nextFilters = filters) {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try { setState({ loading: false, error: '', data: await getUsers(nextFilters) }); }
    catch (error) { setState((current) => ({ ...current, loading: false, error: error.response?.data?.error?.message ?? 'Unable to load users' })); }
  }

  useEffect(() => { loadUsers(); }, []);

  function updateFilter(event) { setFilters({ ...filters, [event.target.name]: event.target.value }); }
  function submit(event) { event.preventDefault(); loadUsers(); }
  async function toggle(user) {
    if (!window.confirm(`${user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} ${user.email}?`)) return;
    try { const updated = await updateUserStatus(user._id, user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'); setState((current) => ({ ...current, data: { ...current.data, users: current.data.users.map((item) => item._id === updated._id ? updated : item) } })); setMessage(`Updated ${updated.email}`); }
    catch (error) { setMessage(error.response?.data?.error?.message ?? 'Unable to update user'); }
  }

  return <main className="shell feature-shell"><Link className="text-link" to="/">Back home</Link><p className="eyebrow">System administration</p><h1>Keep the system healthy.</h1><form className="filter-form" onSubmit={submit}><input name="search" placeholder="Search name or email" value={filters.search} onChange={updateFilter} /><select name="role" value={filters.role} onChange={updateFilter}><option value="">All roles</option><option value="STUDENT">Students</option><option value="ADMIN">Admins</option></select><select name="status" value={filters.status} onChange={updateFilter}><option value="">All statuses</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select><button className="button" disabled={state.loading}>{state.loading ? 'Loading...' : 'Filter users'}</button></form>{message && <p className="form-success" role="status">{message}</p>}{state.error && <p className="form-error" role="alert">{state.error}</p>}{!state.loading && <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th></tr></thead><tbody>{state.data.users.map((user) => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td><strong className={`status status-${user.status.toLowerCase()}`}>{user.status}</strong></td><td><button className="link-button" onClick={() => toggle(user)}>{user.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table>{!state.data.users.length && <p className="intro">No users match these filters.</p>}</div>}</main>;
}
