import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function AuthPage({ mode = 'login' }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await (isRegister ? register(form) : login({ email: form.email, password: form.password }));
      navigate('/');
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message ?? (requestError.request ? `The API is unreachable at ${requestError.config?.baseURL ?? 'the configured URL'}. Confirm the backend is running on port 5000.` : requestError.message ?? 'Unable to complete request'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="shell">
      <p className="eyebrow">Student support</p>
      <h1>{isRegister ? 'Create your account.' : 'Welcome back.'}</h1>
      {location.state?.message && <p className="form-success" role="status" aria-live="polite">{location.state.message}</p>}
      <form className="auth-form" onSubmit={submit}>
        {isRegister && <label>Full name<input name="name" placeholder="Alex Johnson" value={form.name} onChange={updateField} required maxLength={80} /></label>}
        <label>Email address<input name="email" type="email" placeholder="you@university.edu" value={form.email} onChange={updateField} required /></label>
        <label>Password<input name="password" type="password" placeholder="8 or more characters" value={form.password} onChange={updateField} required minLength={8} /></label>
        {error && <p className="form-error" role="alert" aria-live="assertive">{error}</p>}
        <button className="button" disabled={submitting}>{submitting ? 'Working...' : isRegister ? 'Create account' : 'Log in'}</button>
      </form>
      <div className="auth-links"><Link className="text-link" to={isRegister ? '/login' : '/register'}>{isRegister ? 'Already have an account?' : 'Create a student account'}</Link>{!isRegister && <Link className="text-link" to="/forgot-password">Forgot password?</Link>}</div>
    </main>
  );
}
