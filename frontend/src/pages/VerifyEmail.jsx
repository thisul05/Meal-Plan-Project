import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail, resendVerification } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmail() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const { login }  = useAuth();
  const token      = params.get('token');

  const [status, setStatus]     = useState(token ? 'verifying' : 'pending');
  const [email, setEmail]       = useState('');
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    if (!token) return;

    verifyEmail(token)
      .then(data => {
        login(data.user, data.token);
        setStatus('success');
        setTimeout(() => navigate('/'), 2000);
      })
      .catch(err => {
        setStatus('error');
        console.error(err);
      });
  }, [token]);  // eslint-disable-line react-hooks/exhaustive-deps

  async function handleResend(e) {
    e.preventDefault();
    if (!email) return;
    setResending(true);
    try {
      await resendVerification(email);
      setResendMsg('✅ A new link has been sent — check your inbox!');
    } catch {
      setResendMsg('Something went wrong. Please try again.');
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div className="auth-icon">⏳</div>
            <h1 className="auth-title">Verifying…</h1>
            <p className="auth-sub">Just a moment while we confirm your email.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="auth-icon">🎉</div>
            <h1 className="auth-title" style={{ color: 'var(--green)' }}>Email verified!</h1>
            <p className="auth-sub">Your account is active. Redirecting you now…</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="auth-icon">❌</div>
            <h1 className="auth-title">Link expired</h1>
            <p className="auth-sub" style={{ marginBottom: '1.75rem' }}>
              This verification link is invalid or has already been used.
              Enter your email below to get a fresh one.
            </p>
            <form onSubmit={handleResend} style={{ textAlign: 'left' }}>
              <div className="auth-field">
                <label htmlFor="email">Your email</label>
                <input
                  id="email" type="email" className="auth-input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                />
              </div>
              {resendMsg && (
                <p style={{ fontSize: '.875rem', margin: '.5rem 0 1rem', color: resendMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>
                  {resendMsg}
                </p>
              )}
              <button type="submit" className="btn-primary" style={{ marginTop: '.5rem' }} disabled={resending}>
                {resending ? '⏳ Sending…' : '📧 Resend verification email'}
              </button>
            </form>
            <p className="auth-footer"><Link to="/login">Back to login</Link></p>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="auth-icon">📬</div>
            <h1 className="auth-title">Check your inbox</h1>
            <p className="auth-sub" style={{ marginBottom: '1.75rem' }}>
              We sent a verification link to your email. Click it to activate your account.
            </p>
            <div style={{
              background: 'var(--blue-lt)', border: '1.5px solid var(--blue-mid)',
              borderRadius: 10, padding: '1rem', fontSize: '.9rem',
              color: 'var(--blue)', marginBottom: '1.5rem', lineHeight: 1.7,
            }}>
              Didn't get it? Check your spam folder, or resend below.
            </div>
            <form onSubmit={handleResend} style={{ textAlign: 'left' }}>
              <div className="auth-field">
                <label htmlFor="email">Resend to</label>
                <input
                  id="email" type="email" className="auth-input"
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required
                />
              </div>
              {resendMsg && (
                <p style={{ fontSize: '.875rem', margin: '.5rem 0 1rem', color: resendMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>
                  {resendMsg}
                </p>
              )}
              <button type="submit" className="btn-primary" style={{ marginTop: '.5rem' }} disabled={resending}>
                {resending ? '⏳ Sending…' : '📧 Resend verification email'}
              </button>
            </form>
            <p className="auth-footer"><Link to="/login">Already verified? Log in</Link></p>
          </>
        )}
      </div>
    </div>
  );
}
