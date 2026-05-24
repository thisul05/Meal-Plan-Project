import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { fetchLogs, fetchLogsSummary, deleteLog } from '../services/api';
import FoodSearch from '../components/FoodSearch';

// Retrieve the last calculated nutrition targets from localStorage (set in Home.jsx)
function getStoredTargets() {
  try { return JSON.parse(localStorage.getItem('nutritionTargets')); } catch { return null; }
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// ── Progress bar ─────────────────────────────────────────────────────────────
function MacroBar({ label, value, target, color }) {
  const pct = target ? Math.min((value / target) * 100, 100) : 0;
  const over = target && value > target;
  return (
    <div style={{ marginBottom: '.875rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.8rem', fontWeight: 600, marginBottom: '.3rem' }}>
        <span style={{ color: 'var(--gray-600)' }}>{label}</span>
        <span style={{ color: over ? 'var(--red)' : 'var(--gray-900)' }}>
          {value}{label === 'Calories' ? ' kcal' : 'g'}
          {target ? ` / ${target}${label === 'Calories' ? ' kcal' : 'g'}` : ''}
        </span>
      </div>
      <div style={{ height: 10, background: 'var(--gray-100)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 99,
          background: over ? 'var(--red)' : color,
          transition: 'width .5s ease',
        }} />
      </div>
    </div>
  );
}

// ── Slot badge ───────────────────────────────────────────────────────────────
const SLOT_COLORS = { breakfast: 'var(--amber)', lunch: 'var(--blue)', dinner: 'var(--purple)', snack: 'var(--green)' };

export default function Diary() {
  const { token } = useAuth();
  const [date, setDate]       = useState(new Date());
  const [logs, setLogs]       = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const targets = getStoredTargets();

  const dateStr = formatDate(date);
  const isToday = dateStr === formatDate(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [logData, summaryData] = await Promise.all([
        fetchLogs(token, dateStr),
        fetchLogsSummary(token, 7),
      ]);
      setLogs(logData);
      setSummary(summaryData);
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
    // Refresh summary too
    fetchLogsSummary(token, 7).then(setSummary).catch(() => {});
  }

  // Daily totals
  const totals = logs.reduce(
    (acc, l) => ({
      calories: acc.calories + l.calories,
      protein:  acc.protein  + parseFloat(l.protein),
      carbs:    acc.carbs    + parseFloat(l.carbs),
      fat:      acc.fat      + parseFloat(l.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Prepare 7-day chart data — fill in missing days with 0
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(new Date(), -(6 - i));
    const ds = formatDate(d);
    const found = summary.find(s => s.date === ds);
    return {
      day: d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: ds,
      calories: found ? found.calories : 0,
    };
  });

  return (
    <div className="page">
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>📓 Food Diary</h2>
        <Link to="/" style={{ fontSize: '.875rem', color: 'var(--blue)', fontWeight: 600 }}>← Calculator</Link>
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

      {/* Daily summary */}
      <div className="card">
        <h2><span className="section-emoji">📊</span> Daily Summary</h2>
        {!targets && (
          <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', marginBottom: '1rem', background: 'var(--blue-lt)', padding: '.6rem .875rem', borderRadius: 6 }}>
            💡 <Link to="/" style={{ color: 'var(--blue)', fontWeight: 600 }}>Run the calculator</Link> to see your targets here.
          </p>
        )}
        <MacroBar label="Calories" value={Math.round(totals.calories)} target={targets?.targetCalories} color="var(--blue)" />
        <MacroBar label="Protein"  value={Math.round(totals.protein)}  target={targets?.macros?.protein?.grams}  color="var(--blue)" />
        <MacroBar label="Carbs"    value={Math.round(totals.carbs)}    target={targets?.macros?.carbs?.grams}    color="var(--green)" />
        <MacroBar label="Fat"      value={Math.round(totals.fat)}      target={targets?.macros?.fat?.grams}      color="var(--amber)" />
      </div>

      {/* Weekly chart */}
      <div className="card">
        <h2><span className="section-emoji">📈</span> Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => [`${v} kcal`, 'Calories']} />
            {targets?.targetCalories && (
              <ReferenceLine y={targets.targetCalories} stroke="var(--blue)" strokeDasharray="5 3"
                label={{ value: 'Target', fill: 'var(--blue)', fontSize: 11, position: 'right' }} />
            )}
            <Bar dataKey="calories" fill="var(--blue)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
