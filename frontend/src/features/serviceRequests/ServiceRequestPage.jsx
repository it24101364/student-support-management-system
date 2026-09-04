import { Link } from 'react-router-dom';
import ServiceRequestForm from './ServiceRequestForm.jsx';
import ServiceRequestList from './ServiceRequestList.jsx';

export default function ServiceRequestPage() { return <main className="shell feature-shell"><Link className="text-link" to="/">Back home</Link><p className="eyebrow">Service request management</p><h1>Ask for what you need.</h1><ServiceRequestForm /><section><h2>Your requests</h2><ServiceRequestList /></section></main>; }
