import { Link } from 'react-router-dom';
import ComplaintForm from './ComplaintForm.jsx';
import ComplaintList from './ComplaintList.jsx';

export default function ComplaintPage() {
  return <main className="shell feature-shell"><Link className="text-link" to="/">Back home</Link><p className="eyebrow">Complaint management</p><h1>Make the issue visible.</h1><ComplaintForm /><section><h2>Your complaints</h2><ComplaintList /></section></main>;
}
