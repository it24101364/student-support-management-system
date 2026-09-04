import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestPasswordReset, updatePassword, verifyPasswordOtp } from './auth.api.js';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [form, setForm] = useState({ email: '', otp: '', password: '', confirmPassword: '' });
  const [resetToken, setResetToken] = useState('');
  const [state, setState] = useState({ loading: false, error: '', message: '' });

  function update(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  function fail(error) { setState({ loading: false, message: '', error: error.response?.data?.error?.message ?? (error.request ? 'The API is unreachable. Confirm the backend is running.' : 'Unable to complete request') }); }

  async function sendEmail(event) {
    event.preventDefault(); setState({ loading: true, error: '', message: '' });
    try { await requestPasswordReset(form.email); setStep('otp'); setState({ loading: false, error: '', message: 'If an active account exists, a verification code has been sent to that email.' }); } catch (error) { fail(error); }
  }

  async function verify(event) {
    event.preventDefault(); setState({ loading: true, error: '', message: '' });
    try { setResetToken(await verifyPasswordOtp(form.email, form.otp)); setStep('password'); setState({ loading: false, error: '', message: 'Code verified. Create a new password.' }); } catch (error) { fail(error); }
  }

  async function savePassword(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) { setState({ loading: false, error: 'Passwords do not match', message: '' }); return; }
    setState({ loading: true, error: '', message: '' });
    try { await updatePassword(form.email, resetToken, form.password); navigate('/login', { state: { message: 'Password updated. Log in with your new password.' } }); } catch (error) { fail(error); }
  }

  return <main className="shell"><p className="eyebrow">Account recovery</p><h1>{step === 'email' ? 'Find your account.' : step === 'otp' ? 'Check your email.' : 'Choose a new password.'}</h1>{state.message && <p className="form-success" role="status">{state.message}</p>}{state.error && <p className="form-error" role="alert">{state.error}</p>}{step === 'email' && <form className="auth-form" onSubmit={sendEmail}><input name="email" type="email" placeholder="Email address" value={form.email} onChange={update} required /><button className="button" disabled={state.loading}>{state.loading ? 'Sending...' : 'Send verification code'}</button></form>}{step === 'otp' && <form className="auth-form" onSubmit={verify}><input name="otp" inputMode="numeric" pattern="[0-9]{6}" placeholder="6-digit verification code" value={form.otp} onChange={update} required /><button className="button" disabled={state.loading}>{state.loading ? 'Verifying...' : 'Verify code'}</button><button type="button" className="link-button" onClick={() => setStep('email')}>Use a different email</button></form>}{step === 'password' && <form className="auth-form" onSubmit={savePassword}><input name="password" type="password" placeholder="New password (8+ characters)" value={form.password} onChange={update} minLength={8} required /><input name="confirmPassword" type="password" placeholder="Confirm new password" value={form.confirmPassword} onChange={update} minLength={8} required /><button className="button" disabled={state.loading}>{state.loading ? 'Updating...' : 'Update password'}</button></form>}<Link className="text-link" to="/login">Back to login</Link></main>;
}
