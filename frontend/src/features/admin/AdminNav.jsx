import { Link } from 'react-router-dom';

export default function AdminNav() { return <nav className="admin-nav"><Link className="button" to="/admin/analytics">Analytics</Link><Link className="button" to="/admin/users">Users</Link></nav>; }
