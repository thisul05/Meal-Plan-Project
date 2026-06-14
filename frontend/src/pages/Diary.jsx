import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchLogs, deleteLog } from '../services/api';
import FoodSearch from '../components/FoodSearch';

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// ── Slot badge ───────────────────────────────────────────────────────────────
const SLOT_COLORS = { breakfast: 'var(--amber)', lunch: 'var(--blue)', dinner: 'var(--purple)', snack: 'var(--green)' };

export default function Diary() {
  const { token } = useAuth();
  const [date, setDate]   = useState(new Date());
  const [logs, setLogs]   = useState([]);
  const [loading, setLoading] = useState(true);

  const dateStr = formatDate(date);
  const isToday = dateStr === formatDate(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const logData = await fetchLogs(token, dateStr);
      setLogs(logData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, dateStr]);

  useEffect(() => { load(); }, [load]);

  async function handleDelete(id) {
    await deleteLog(token, id);
    setLogs(prev => prev.filter(l => l.id !== id));
  }


  return (
    <div className="page">
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📓 Food Diary</h2>
        <Link to="/progress" style={{ fontSize: '.875rem', color: 'var(--blue)', fontWeight: 600 }}>← Progress</Link>
      </div>

      {/* Date navigator */}
      <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => setDate(d => addDays(d, -1))} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>‹</button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
            {isToday ? 'Today' : date.toLocaleDateString('en-GB', { weekday: 'long' })}
          </div>
          <div style={{ fontSize: '.8rem', color: 'var(--gray-600)' }}>
            {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <button onClick={() => setDate(d => addDays(d, 1))} disabled={isToday}
          style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: isToday ? 'not-allowed' : 'pointer', opacity: isToday ? .3 : 1 }}>›</button>
      </div>

      {/* Food search */}
      <div className="card">
        <h2><span className="section-emoji">🔍</span> Log a Food</h2>
        <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', marginBottom: '.875rem' }}>
          Search the USDA database for any food, enter your portion size, and log it straight to today's diary.
        </p>
        <FoodSearch date={dateStr} onLogged={load} />
      </div>

      {/* Logged meals */}
      <div className="card">
        <h2><span className="section-emoji">🍽️</span> Logged Meals</h2>
        {loading ? (
          <p style={{ color: 'var(--gray-400)', textAlign: 'center', padding: '1.5rem' }}>Loading…</p>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--gray-400)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>🍴</div>
            <p style={{ fontWeight: 600, color: 'var(--gray-600)' }}>Nothing logged yet</p>
            <p style={{ fontSize: '.875rem', marginTop: '.25rem' }}>
              Search for a food above, or generate a meal plan and click "Log Meal".
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {logs.map(l => (
              <div key={l.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '.75rem 1rem', border: '1.5px solid var(--gray-200)',
                borderRadius: 8, gap: '.5rem',
                borderLeft: `4px solid ${SLOT_COLORS[l.meal_slot] || 'var(--gray-300)'}`,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {l.meal_slot && (
                    <span style={{ fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em', color: SLOT_COLORS[l.meal_slot], display: 'block', marginBottom: '.15rem' }}>
                      {l.meal_slot}
                    </span>
                  )}
                  <div style={{ fontWeight: 600, fontSize: '.95rem' }}>{l.name}</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--gray-600)', marginTop: '.15rem' }}>
                    🔥 {l.calories} kcal · P {l.protein}g · C {l.carbs}g · F {l.fat}g
                  </div>
                </div>
                <button onClick={() => handleDelete(l.id)} title="Remove"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--gray-400)', padding: '.25rem', flexShrink: 0 }}>
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
