import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchSavedPlans, deleteSavedPlan } from '../services/api';

function SavedPlans() {
  const { token } = useAuth();
  const [plans, setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    fetchSavedPlans(token)
      .then(setPlans)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id) {
    try {
      await deleteSavedPlan(id, token);
      setPlans(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="page" style={{ textAlign: 'center', paddingTop: '3rem' }}>Loading…</div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📋 My Saved Plans</h2>
        <Link to="/" style={{ fontSize: '.875rem', color: 'var(--blue)', fontWeight: 600 }}>← Back to calculator</Link>
      </div>

      {error && <div className="error-banner">⚠️ {error}</div>}

      {plans.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-400)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>🍽️</div>
          <p style={{ fontWeight: 600, color: 'var(--gray-600)' }}>No saved plans yet</p>
          <p style={{ fontSize: '.875rem', marginTop: '.25rem' }}>Generate a meal plan and click "Save Plan" to store it here.</p>
          <Link to="/" className="btn-primary" style={{ marginTop: '1.25rem', display: 'inline-block', width: 'auto', padding: '.6rem 1.5rem' }}>
            Go to calculator
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.875rem' }}>
          {plans.map(p => {
            const plan = p.plan_data;
            const meals = plan.meals || [];
            return (
              <div key={p.id} className="card" style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.25rem' }}>
                      {new Date(p.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </div>
                    <div style={{ fontSize: '.82rem', color: 'var(--gray-600)' }}>
                      🔥 {p.calories} kcal · {meals.length} meals
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ background: 'var(--red-lt)', border: '1.5px solid #fca5a5', color: 'var(--red)', borderRadius: 6, padding: '.35rem .75rem', cursor: 'pointer', fontSize: '.8rem', fontWeight: 600, fontFamily: 'inherit' }}>
                    🗑 Delete
                  </button>
                </div>
                <div style={{ marginTop: '.875rem', display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                  {meals.map((m, i) => (
                    <span key={i} style={{ background: 'var(--gray-100)', borderRadius: 99, padding: '.2rem .65rem', fontSize: '.78rem', fontWeight: 600 }}>
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedPlans;
