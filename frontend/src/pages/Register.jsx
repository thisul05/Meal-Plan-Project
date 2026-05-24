import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../services/api';

function getStrength(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['', '#dc2626', '#d97706', '#2563eb', '#16a34a'];

function EyeIcon({ open }) {
  return open
    ? <span style={{ fontSize: '1.1rem' }}>👁</span>
    : <span style={{ fontSize: '1.1rem', opacity: .6 }}>🙈</span>;
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);

  const strength = getStrength(form.password);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8)       { setError('Password must be at least 8 characters'); return; }

    setLoading(true);
    try {
      await apiRegister(form.name, form.email, form.password);
      navigate('/login', {
        state: { message: '✅ Account created! Check your email to verify, then log in.' },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-icon">🥗</div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start planning your nutrition today</p>

        {error && (
          <div className="auth-notice auth-notice--error">⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="name">Full name <span style={{ color: 'var(--gray-400)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
            <input
              id="name" name="name" type="text"
              className="auth-input" autoComplete="name"
              value={form.name} onChange={handleChange}
              placeholder="Your name"
            />
          </div>

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
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <input
                id="password" name="password"
                type={showPwd ? 'text' : 'password'}
                className="auth-input with-toggle"
                autoComplete="new-password"
                value={form.password} onChange={handleChange}
                placeholder="At least 8 characters" required
              />
              <button type="button" className="auth-input-toggle" onClick={() => setShowPwd(v => !v)} tabIndex={-1}>
                <EyeIcon open={showPwd} />
              </button>
            </div>
            {form.password && (
              <div className="pwd-strength">
                <div className="pwd-strength-bar">
                  <div className="pwd-strength-fill" style={{
                    width: `${(strength / 4) * 100}%`,
                    background: STRENGTH_COLOR[strength],
                  }} />
                </div>
                <span className="pwd-strength-label" style={{ color: STRENGTH_COLOR[strength] }}>
                  {STRENGTH_LABEL[strength]}
                </span>
              </div>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="confirm">Confirm password</label>
            <div className="auth-input-wrap">
              <input
                id="confirm" name="confirm"
                type={showCfm ? 'text' : 'password'}
                className={`auth-input with-toggle ${form.confirm && form.confirm !== form.password ? 'has-error' : ''}`}
                autoComplete="new-password"
                value={form.confirm} onChange={handleChange}
                placeholder="Repeat your password" required
              />
              <button type="button" className="auth-input-toggle" onClick={() => setShowCfm(v => !v)} tabIndex={-1}>
                <EyeIcon open={showCfm} />
              </button>
            </div>
            {form.confirm && form.confirm !== form.password && (
              <span style={{ fontSize: '.78rem', color: 'var(--red)', marginTop: '.25rem', display: 'block' }}>
                Passwords don't match
              </span>
            )}
          </div>

          <div className="auth-terms">
            By creating an account you agree to our&nbsp;
            <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Terms of Service</span>&nbsp;
            and&nbsp;
            <span style={{ color: 'var(--blue)', fontWeight: 600 }}>Privacy Policy</span>.
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }} disabled={loading}>
            {loading ? '⏳ Creating account…' : '🚀 Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
