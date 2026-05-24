import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as apiLogin, resendVerification } from '../services/api';
import { useAuth } from '../context/AuthContext';

function EyeIcon({ open }) {
  return open
    ? <span style={{ fontSize: '1.1rem' }}>👁</span>
    : <span style={{ fontSize: '1.1rem', opacity: .6 }}>🙈</span>;
}

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [form, setForm]         = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);
  const [needsVerify, setNeedsVerify] = useState(false);
  const [resendDone, setResendDone]   = useState(false);
  const [resending, setResending]     = useState(false);

  // Flash message from Register page redirect
  const flash = location.state?.message;

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setNeedsVerify(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await apiLogin(form.email, form.password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      if (err.needsVerification) setNeedsVerify(true);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    try {
      await resendVerification(form.email);
      setResendDone(true);
    } catch {
      // ignore
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Log in to view and save your meal plans</p>

        {flash && (
          <div className="auth-notice auth-notice--success">
            {flash}
          </div>
        )}

        {error && (
          <div className="auth-notice auth-notice--error">
            ⚠️ {error}
            {needsVerify && !resendDone && (
              <button
                onClick={handleResend}
                disabled={resending}
                className="auth-resend-btn"
              >
                {resending ? 'Sending…' : 'Resend verification email'}
              </button>
            )}
            {resendDone && (
              <span className="auth-resend-done"> ✅ Link sent! Check your inbox.</span>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email" name="email" type="email"
              className="auth-input" autoComplete="email"
              value={form.email} onChange={handleChange}
              placeholder="you@example.com" required
            />
          </div>

          <div className="auth-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
              <label htmlFor="password" style={{ margin: 0 }}>Password</label>
            </div>
            <div className="auth-input-wrap">
              <input
                id="password" name="password"
                type={showPwd ? 'text' : 'password'}
                className="auth-input with-toggle"
                autoComplete="current-password"
                value={form.password} onChange={handleChange}
                placeholder="Your password" required
              />
              <button type="button" className="auth-input-toggle" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                <EyeIcon open={showPwd} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1.75rem' }} disabled={loading}>
            {loading ? '⏳ Logging in…' : '🔑 Log In'}
          </button>
        </form>

        <p className="auth-footer">
          No account yet? <Link to="/register">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
