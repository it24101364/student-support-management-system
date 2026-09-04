import { useEffect, useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import client from '../../api/client.js';

const complaintStatuses = ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'REJECTED', 'CLOSED'];
const requestStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'PROCESSING', 'COMPLETED', 'REJECTED'];
const priorities = ['Low', 'Medium', 'High'];
const categories = ['Academic', 'Hostel', 'IT Support', 'Library', 'Finance', 'Facilities', 'Other'];
const requestTypes = ['ID Card Replacement', 'Transcript Request', 'Certificate Request', 'Hostel Maintenance', 'IT Support Request', 'Library Request', 'Other'];

function numberFor(record, kind) { return kind === 'complaint' ? record.complaintNumber : record.requestNumber; }

function downloadPdf(records, kind, filters) {
  const pdf = new jsPDF({ orientation: 'landscape' });
  const title = kind === 'complaint' ? 'Complaint report' : 'Service request report';
  pdf.setFontSize(18); pdf.text(title, 14, 16); pdf.setFontSize(9); pdf.text(`Filtered records: ${records.length}`, 14, 23); pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 29);
  const headers = kind === 'complaint' ? 'Reference    Student    Title    Category    Priority    Status    Admin reply' : 'Reference    Student    Title    Request type    Priority    Status    Admin reply';
  pdf.setFont('helvetica', 'bold'); pdf.text(headers, 14, 39); pdf.setFont('helvetica', 'normal');
  records.forEach((record, index) => { const row = [numberFor(record, kind), record.studentId?.name ?? 'Unknown', record.title, kind === 'complaint' ? record.category : record.requestType, record.priority, record.status.replaceAll('_', ' '), record.adminReply || 'No reply'].map((value) => String(value).slice(0, 25)).join('    '); const y = 46 + (index % 21) * 7; if (index && index % 21 === 0) pdf.addPage('a4', 'landscape'); pdf.text(row, 14, y); });
  const filterText = [filters.search && `Search: ${filters.search}`, filters.status && `Status: ${filters.status}`, filters.priority && `Priority: ${filters.priority}`, filters.kindFilter && `${kind === 'complaint' ? 'Category' : 'Type'}: ${filters.kindFilter}`].filter(Boolean).join(' | ');
  if (filterText) pdf.text(filterText.slice(0, 150), 14, 202);
  pdf.save(`${kind}-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function RecordEditor({ record, kind, onSaved }) {
  const statuses = kind === 'complaint' ? complaintStatuses : requestStatuses;
  const [status, setStatus] = useState(record.status); const [reply, setReply] = useState(record.adminReply ?? ''); const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  async function save(event) { event.preventDefault(); setSaving(true); setError(''); try { const { data } = await client.patch(`/admin/${kind === 'complaint' ? 'complaints' : 'service-requests'}/${record._id}`, { status, reply }); onSaved(data.data); } catch (requestError) { setError(requestError.response?.data?.error?.message ?? 'Unable to save'); } finally { setSaving(false); } }
  return <form className="record-editor" onSubmit={save}><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((value) => <option key={value}>{value.replaceAll('_', ' ')}</option>)}</select><textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="Reply to student" maxLength={5000} rows={2} /><button className="button" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>{error && <span className="form-error">{error}</span>}</form>;
}

function RecordsTable({ records, kind, onSaved }) {
  return <div className="table-wrap"><table className="records-table"><thead><tr><th>Reference</th><th>Student</th><th>Title</th><th>{kind === 'complaint' ? 'Category' : 'Request type'}</th><th>Priority</th><th>Status</th><th>Admin response</th></tr></thead><tbody>{records.map((record) => <tr className={record.status === 'REJECTED' ? 'rejected-row' : ''} key={record._id}><td>{numberFor(record, kind)}</td><td>{record.studentId?.name}<small>{record.studentId?.email}</small></td><td>{record.title}<small>{record.description}</small></td><td>{kind === 'complaint' ? record.category : record.requestType}</td><td>{record.priority}</td><td><strong className={`status status-${record.status.toLowerCase()}`}>{record.status.replaceAll('_', ' ')}</strong></td><td><RecordEditor record={record} kind={kind} onSaved={onSaved} /></td></tr>)}</tbody></table>{!records.length && <p className="intro">No records match these filters.</p>}</div>;
}

export default function AdminRecords() {
  const [activeTab, setActiveTab] = useState('complaint'); const [records, setRecords] = useState({ complaints: [], requests: [] }); const [filters, setFilters] = useState({ search: '', status: '', priority: '', kindFilter: '' }); const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => { Promise.all([client.get('/admin/complaints'), client.get('/admin/service-requests')]).then(([complaints, requests]) => { setRecords({ complaints: complaints.data.data, requests: requests.data.data }); setState({ loading: false, error: '' }); }).catch((error) => setState({ loading: false, error: error.response?.data?.error?.message ?? 'Unable to load records' })); }, []);
  const kind = activeTab; const source = kind === 'complaint' ? records.complaints : records.requests;
  const filteredRecords = useMemo(() => source.filter((record) => { const search = filters.search.trim().toLowerCase(); const matchesSearch = !search || [numberFor(record, kind), record.title, record.description, record.studentId?.name, record.studentId?.email].some((value) => value?.toLowerCase().includes(search)); const value = kind === 'complaint' ? record.category : record.requestType; return matchesSearch && (!filters.status || record.status === filters.status) && (!filters.priority || record.priority === filters.priority) && (!filters.kindFilter || value === filters.kindFilter); }), [filters, kind, source]);
  function updateFilter(event) { setFilters({ ...filters, [event.target.name]: event.target.value }); } function resetFilters() { setFilters({ search: '', status: '', priority: '', kindFilter: '' }); } function saved(updated) { const key = kind === 'complaint' ? 'complaints' : 'requests'; setRecords((current) => ({ ...current, [key]: current[key].map((record) => record._id === updated._id ? updated : record) })); }
  if (state.loading) return <main className="shell"><p className="intro">Loading records...</p></main>; if (state.error) return <main className="shell"><p className="form-error" role="alert">{state.error}</p></main>;
  return <main className="shell feature-shell"><Link className="text-link" to="/">Back home</Link><p className="eyebrow">Case management</p><h1>Review every case.</h1><div className="record-tabs"><button className={kind === 'complaint' ? 'active' : ''} onClick={() => { setActiveTab('complaint'); resetFilters(); }}>Complaints <span>{records.complaints.length}</span></button><button className={kind === 'request' ? 'active' : ''} onClick={() => { setActiveTab('request'); resetFilters(); }}>Service requests <span>{records.requests.length}</span></button></div><form className="filter-form record-filters" onSubmit={(event) => event.preventDefault()}><input name="search" placeholder="Search reference, student, title" value={filters.search} onChange={updateFilter} /><select name="status" value={filters.status} onChange={updateFilter}><option value="">All statuses</option>{(kind === 'complaint' ? complaintStatuses : requestStatuses).map((value) => <option key={value}>{value}</option>)}</select><select name="priority" value={filters.priority} onChange={updateFilter}><option value="">All priorities</option>{priorities.map((value) => <option key={value}>{value}</option>)}</select><select name="kindFilter" value={filters.kindFilter} onChange={updateFilter}><option value="">All {kind === 'complaint' ? 'categories' : 'request types'}</option>{(kind === 'complaint' ? categories : requestTypes).map((value) => <option key={value}>{value}</option>)}</select><button type="button" className="button secondary-button" onClick={resetFilters}>Reset</button><button type="button" className="button" onClick={() => downloadPdf(filteredRecords, kind, filters)}>Download PDF</button></form><p className="result-count">Showing {filteredRecords.length} of {source.length} {kind === 'complaint' ? 'complaints' : 'service requests'}</p><RecordsTable records={filteredRecords} kind={kind} onSaved={saved} /></main>;
}
