import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { fetchWeight, logWeight, deleteWeight, fetchLogsSummary, fetchLogs } from '../services/api';

// ── Daily macro bar ───────────────────────────────────────────────────────────
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
        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: over ? 'var(--red)' : color, transition: 'width .5s ease' }} />
      </div>
    </div>
  );
}

function getCalculatedTargets() {
  try { return JSON.parse(localStorage.getItem('nutritionTargets')); } catch { return null; }
}

function getEffectiveTargets() {
  try {
    const pref = JSON.parse(localStorage.getItem('macroPreferences'));
    if (pref?.useCustom) return pref;
  } catch { /* ignore */ }
  return getCalculatedTargets();
}

function formatDate(d) { return d.toISOString().split('T')[0]; }

function addDays(date, n) {
  const d = new Date(date); d.setDate(d.getDate() + n); return d;
}

// ── Motivation engine ─────────────────────────────────────────────────────────
function getMotivation(weightLogs, calorieSummary, targets) {
  const hasWeight   = weightLogs.length > 0;
  const hasCalories = calorieSummary.length > 0;

  if (!hasWeight && !hasCalories) {
    return {
      emoji: '🌱',
      headline: 'Your journey starts today!',
      message: 'Log your weight and start tracking meals. Even one data point is progress.',
      color: 'var(--blue)',
      bg: 'var(--blue-lt)',
    };
  }

  // Weight trend: compare latest vs 7 days ago
  let weightTrend = null;
  if (weightLogs.length >= 2) {
    const latest = weightLogs[weightLogs.length - 1].weight_kg;
    const weekAgo = weightLogs.find(w => w.date <= formatDate(addDays(new Date(), -7)));
    if (weekAgo) {
      const diff = latest - weekAgo.weight_kg;
      weightTrend = diff < -0.3 ? 'losing' : diff > 0.3 ? 'gaining' : 'stable';
    }
  }

  // Calorie adherence: how many of last 7 days hit ±15% of target
  let adherencePct = null;
  if (hasCalories && targets?.targetCalories) {
    const last7 = calorieSummary.slice(-7);
    const hits = last7.filter(d => {
      const ratio = d.calories / targets.targetCalories;
      return ratio >= 0.85 && ratio <= 1.15;
    }).length;
    adherencePct = Math.round((hits / last7.length) * 100);
  }

  // Streak: consecutive days with calorie logs
  let streak = 0;
  const today = formatDate(new Date());
  for (let i = 0; i < 30; i++) {
    const ds = formatDate(addDays(new Date(), -i));
    if (calorieSummary.find(d => d.date === ds)) streak++;
    else break;
  }

  // Pick message
  if (streak >= 7) return {
    emoji: '🔥', headline: `${streak}-day logging streak!`,
    message: 'Incredible consistency. Tracking is the #1 habit that separates people who reach their goals from those who don\'t.',
    color: 'var(--amber)', bg: '#fff7ed',
  };

  if (weightTrend === 'losing' && adherencePct >= 70) return {
    emoji: '🎉', headline: 'You\'re making real progress!',
    message: 'Your weight is trending down and you\'re hitting your calorie targets. This is exactly what sustainable fat loss looks like — keep going!',
    color: 'var(--green)', bg: 'var(--green-lt)',
  };

  if (weightTrend === 'stable' && adherencePct >= 70) return {
    emoji: '⚖️', headline: 'Perfect maintenance mode!',
    message: 'You\'re holding steady and staying on target. Maintaining weight is genuinely hard — this takes real discipline.',
    color: 'var(--blue)', bg: 'var(--blue-lt)',
  };

  if (weightTrend === 'gaining' && adherencePct >= 70) return {
    emoji: '💪', headline: 'Building strong!',
    message: 'You\'re in a controlled surplus and hitting your nutrition targets. Stay patient — muscle takes time but it\'s coming.',
    color: 'var(--purple)', bg: 'var(--purple-lt)',
  };

  if (adherencePct !== null && adherencePct < 50) return {
    emoji: '📋', headline: 'Let\'s get back on track',
    message: `You've hit your calorie target on ${adherencePct}% of logged days. Small, consistent steps beat perfect days followed by nothing. One meal at a time!`,
    color: 'var(--amber)', bg: '#fff7ed',
  };

  if (streak >= 3) return {
    emoji: '📈', headline: `${streak} days in a row!`,
    message: 'Building the logging habit is half the battle. Keep showing up daily and the results will follow.',
    color: 'var(--green)', bg: 'var(--green-lt)',
  };

  if (hasWeight && !hasCalories) return {
    emoji: '🍽️', headline: 'Add meal tracking to complete the picture',
    message: 'You\'re logging your weight — great start! Pair it with calorie tracking on the Diary page to unlock your full progress chart.',
    color: 'var(--blue)', bg: 'var(--blue-lt)',
  };

  return {
    emoji: '🚀', headline: 'Keep the momentum going!',
    message: 'Every log brings you closer to your goal. Consistency over perfection — always.',
    color: 'var(--blue)', bg: 'var(--blue-lt)',
  };
}

// ── Custom chart tooltip ──────────────────────────────────────────────────────
function WeightTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '.5rem .75rem', fontSize: '.8rem' }}>
      <div style={{ fontWeight: 700, marginBottom: '.2rem' }}>{label}</div>
      <div style={{ color: 'var(--blue)' }}>{payload[0].value} kg</div>
    </div>
  );
}

function CalorieTooltip({ active, payload, label, target }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const onTarget = target && val >= target * 0.85 && val <= target * 1.15;
  return (
    <div style={{ background: 'white', border: '1.5px solid var(--gray-200)', borderRadius: 8, padding: '.5rem .75rem', fontSize: '.8rem' }}>
      <div style={{ fontWeight: 700, marginBottom: '.2rem' }}>{label}</div>
      <div style={{ color: onTarget ? 'var(--green)' : 'var(--amber)' }}>{val} kcal</div>
      {target && <div style={{ color: 'var(--gray-500)' }}>Target: {target} kcal</div>}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Progress() {
  const { token } = useAuth();

  const [targets,       setTargets]       = useState(() => getEffectiveTargets());
  const [weightLogs,    setWeightLogs]    = useState([]);
  const [calorieSummary,setCalorieSummary]= useState([]);
  const [todayLogs,     setTodayLogs]     = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [weightInput,   setWeightInput]   = useState('');
  const [saving,        setSaving]        = useState(false);
  const [saveMsg,       setSaveMsg]       = useState('');
  const [range,         setRange]         = useState(30);

  // ── Macro preferences state ───────────────────────────────────────────────
  const calcTargets = getCalculatedTargets();
  const [prefMode, setPrefMode] = useState(() => {
    try { return JSON.parse(localStorage.getItem('macroPreferences'))?.useCustom ? 'custom' : 'auto'; } catch { return 'auto'; }
  });
  const [customForm, setCustomForm] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem('macroPreferences'));
      const c = getCalculatedTargets();
      return {
        calories: p?.targetCalories         ?? c?.targetCalories         ?? '',
        protein:  p?.macros?.protein?.grams ?? c?.macros?.protein?.grams ?? '',
        carbs:    p?.macros?.carbs?.grams   ?? c?.macros?.carbs?.grams   ?? '',
        fat:      p?.macros?.fat?.grams     ?? c?.macros?.fat?.grams     ?? '',
      };
    } catch { return { calories: '', protein: '', carbs: '', fat: '' }; }
  });
  const [savePrefMsg, setSavePrefMsg] = useState('');

  const todayStr = formatDate(new Date());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [wData, cData, lData] = await Promise.all([
        fetchWeight(token, range),
        fetchLogsSummary(token, range),
        fetchLogs(token, todayStr),
      ]);
      setWeightLogs(wData);
      setCalorieSummary(cData);
      setTodayLogs(lData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, range, todayStr]);

  useEffect(() => { load(); }, [load]);

  async function handleLogWeight(e) {
    e.preventDefault();
    const kg = parseFloat(weightInput);
    if (!kg || kg < 20 || kg > 300) return;
    setSaving(true);
    setSaveMsg('');
    try {
      await logWeight(token, kg, todayStr);
      setSaveMsg('✅ Weight saved!');
      setWeightInput('');
      load();
    } catch (err) {
      setSaveMsg('⚠️ ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    await deleteWeight(token, id);
    setWeightLogs(prev => prev.filter(w => w.id !== id));
  }

  function saveCustomTargets(e) {
    e.preventDefault();
    const cal  = parseInt(customForm.calories);
    const prot = parseInt(customForm.protein);
    const carb = parseInt(customForm.carbs);
    const fat  = parseInt(customForm.fat);
    if (!cal || !prot || !carb || !fat) return;
    const custom = {
      useCustom: true,
      targetCalories: cal,
      macros: {
        protein: { grams: prot, percent: Math.round((prot * 4 / cal) * 100) },
        carbs:   { grams: carb, percent: Math.round((carb * 4 / cal) * 100) },
        fat:     { grams: fat,  percent: Math.round((fat  * 9 / cal) * 100) },
      },
    };
    localStorage.setItem('macroPreferences', JSON.stringify(custom));
    setTargets(custom);
    setSavePrefMsg('✅ Custom targets saved!');
    setTimeout(() => setSavePrefMsg(''), 2500);
  }

  function switchToAuto() {
    try {
      const pref = JSON.parse(localStorage.getItem('macroPreferences')) || {};
      localStorage.setItem('macroPreferences', JSON.stringify({ ...pref, useCustom: false }));
    } catch { /* ignore */ }
    setTargets(getCalculatedTargets());
    setPrefMode('auto');
  }

  function switchToCustom() {
    setPrefMode('custom');
  }

  // Build 30-day grid so missing days show as gaps, not missing bars
  const calendarDays = Array.from({ length: range }, (_, i) => {
    const d = addDays(new Date(), -(range - 1 - i));
    const ds = formatDate(d);
    const found = calorieSummary.find(s => s.date === ds);
    return {
      day: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      date: ds,
      calories: found ? found.calories : 0,
      hasData: !!found,
    };
  });

  // Format weight logs for chart (use short date labels)
  const weightChartData = weightLogs.map(w => ({
    ...w,
    day: new Date(w.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  }));

  const todayWeight = weightLogs.find(w => w.date === todayStr);
  const motivation  = getMotivation(weightLogs, calorieSummary, targets);

  const todayTotals = todayLogs.reduce(
    (acc, l) => ({
      calories: acc.calories + l.calories,
      protein:  acc.protein  + parseFloat(l.protein),
      carbs:    acc.carbs    + parseFloat(l.carbs),
      fat:      acc.fat      + parseFloat(l.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Bar colours: green if on target, amber if not, gray if no data
  const getBarColor = (entry) => {
    if (!entry.hasData) return 'var(--gray-200)';
    if (!targets?.targetCalories) return 'var(--blue)';
    const ratio = entry.calories / targets.targetCalories;
    return ratio >= 0.85 && ratio <= 1.15 ? 'var(--green)' : 'var(--amber)';
  };

  return (
    <>
      <header className="app-header" style={{ minHeight: '200px' }}>
        <div className="header-content">
          <div className="header-badge">📈 Progress Tracker</div>
          <h1>My Progress</h1>
          <p>Track your weight · monitor calorie consistency · stay motivated</p>
        </div>
      </header>

      <main className="page">

        {/* Motivation card */}
        <div className="card progress-motivation-card" style={{ background: motivation.bg, borderLeft: `4px solid ${motivation.color}` }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{motivation.emoji}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: motivation.color, marginBottom: '.3rem' }}>
                {motivation.headline}
              </div>
              <p style={{ fontSize: '.875rem', color: 'var(--gray-700)', margin: 0, lineHeight: 1.5 }}>
                {motivation.message}
              </p>
            </div>
          </div>
        </div>

        {/* Daily Summary */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}><span className="section-emoji">📊</span> Daily Summary</h2>
            <Link to="/diary"
              style={{ fontSize: '.82rem', fontWeight: 700, color: 'white', background: 'var(--blue)', borderRadius: 99, padding: '.35rem .9rem', textDecoration: 'none' }}>
              ➕ Log Food
            </Link>
          </div>
          {!targets && (
            <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', marginBottom: '1rem', background: 'var(--blue-lt)', padding: '.6rem .875rem', borderRadius: 6 }}>
              💡 <Link to="/" style={{ color: 'var(--blue)', fontWeight: 600 }}>Run the calculator</Link> to see your targets here.
            </p>
          )}
          <MacroBar label="Calories" value={Math.round(todayTotals.calories)} target={targets?.targetCalories}          color="var(--blue)"   />
          <MacroBar label="Protein"  value={Math.round(todayTotals.protein)}  target={targets?.macros?.protein?.grams}  color="var(--blue)"   />
          <MacroBar label="Carbs"    value={Math.round(todayTotals.carbs)}    target={targets?.macros?.carbs?.grams}    color="var(--green)"  />
          <MacroBar label="Fat"      value={Math.round(todayTotals.fat)}      target={targets?.macros?.fat?.grams}      color="var(--amber)"  />
        </div>

        {/* Macro target preferences */}
        <div className="card">
          <h2><span className="section-emoji">⚙️</span> Macro Targets</h2>
          <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', marginBottom: '1rem' }}>
            Use the targets calculated by the planner, or set your own custom values.
          </p>

          <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.25rem' }}>
            {[['auto', 'Auto (Calculated)'], ['custom', 'Custom']].map(([mode, label]) => (
              <button key={mode}
                onClick={mode === 'auto' ? switchToAuto : switchToCustom}
                style={{
                  padding: '.45rem 1.1rem', borderRadius: 99, border: 'none', cursor: 'pointer',
                  fontSize: '.82rem', fontWeight: 700,
                  background: prefMode === mode ? 'var(--blue)' : 'var(--gray-100)',
                  color: prefMode === mode ? 'white' : 'var(--gray-700)',
                  transition: 'background .2s, color .2s',
                }}>
                {label}
              </button>
            ))}
          </div>

          {prefMode === 'auto' ? (
            calcTargets ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.75rem' }}>
                {[
                  { label: 'Calories', value: `${calcTargets.targetCalories} kcal` },
                  { label: 'Protein',  value: `${calcTargets.macros?.protein?.grams}g` },
                  { label: 'Carbs',    value: `${calcTargets.macros?.carbs?.grams}g` },
                  { label: 'Fat',      value: `${calcTargets.macros?.fat?.grams}g` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ padding: '.75rem', background: 'var(--gray-100)', borderRadius: 8, border: '1.5px solid var(--gray-200)' }}>
                    <div style={{ fontSize: '.72rem', color: 'var(--gray-500)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', marginTop: '.25rem' }}>{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', background: 'var(--blue-lt)', padding: '.6rem .875rem', borderRadius: 6 }}>
                💡 <Link to="/" style={{ color: 'var(--blue)', fontWeight: 600 }}>Run the calculator</Link> to get auto-calculated targets.
              </p>
            )
          ) : (
            <form onSubmit={saveCustomTargets}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '.75rem', marginBottom: '1rem' }}>
                {[
                  { key: 'calories', label: 'Calories (kcal)', min: 800,  max: 6000 },
                  { key: 'protein',  label: 'Protein (g)',     min: 20,   max: 500  },
                  { key: 'carbs',    label: 'Carbs (g)',       min: 20,   max: 800  },
                  { key: 'fat',      label: 'Fat (g)',         min: 10,   max: 300  },
                ].map(({ key, label, min, max }) => (
                  <div key={key}>
                    <label style={{ fontSize: '.72rem', color: 'var(--gray-500)', fontWeight: 700, display: 'block', marginBottom: '.3rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                      {label}
                    </label>
                    <input
                      type="number" min={min} max={max} required
                      value={customForm[key]}
                      onChange={e => setCustomForm(f => ({ ...f, [key]: e.target.value }))}
                      style={{ width: '100%', padding: '.55rem .75rem', border: '1.5px solid var(--gray-200)', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-secondary" style={{ padding: '.6rem 1.5rem', fontSize: '.875rem' }}>
                💾 Save Custom Targets
              </button>
              {savePrefMsg && (
                <p style={{ marginTop: '.5rem', fontSize: '.85rem', color: 'var(--green)' }}>{savePrefMsg}</p>
              )}
            </form>
          )}
        </div>

        {/* Log weight */}
        <div className="card">
          <h2><span className="section-emoji">⚖️</span> Log Today's Weight</h2>
          {todayWeight && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.6rem .875rem', background: 'var(--green-lt)', borderRadius: 8, marginBottom: '1rem', fontSize: '.875rem' }}>
              <span>✅ Today's entry: <strong>{todayWeight.weight_kg} kg</strong></span>
              <button onClick={() => handleDelete(todayWeight.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: '.9rem' }}>🗑</button>
            </div>
          )}
          <form onSubmit={handleLogWeight} style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
            <input
              type="number" step="0.1" min="20" max="300"
              placeholder="e.g. 72.5"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              className="progress-weight-input"
            />
            <button type="submit" disabled={saving || !weightInput} className="btn-secondary"
              style={{ padding: '.6rem 1.5rem', fontSize: '.875rem' }}>
              {saving ? 'Saving…' : '💾 Save Weight (kg)'}
            </button>
          </form>
          {saveMsg && <p style={{ marginTop: '.5rem', fontSize: '.85rem', color: saveMsg.startsWith('✅') ? 'var(--green)' : 'var(--red)' }}>{saveMsg}</p>}
        </div>

        {/* Range selector */}
        <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'flex-end', marginBottom: '-.5rem' }}>
          {[7, 14, 30].map(r => (
            <button key={r}
              onClick={() => setRange(r)}
              className={`rb-tab ${range === r ? 'active' : ''}`}
              style={{ padding: '.3rem .8rem', fontSize: '.78rem' }}>
              {r}d
            </button>
          ))}
        </div>

        {/* Weight chart */}
        <div className="card">
          <h2><span className="section-emoji">⚖️</span> Weight Trend</h2>
          {loading ? (
            <p className="rb-status">Loading…</p>
          ) : weightLogs.length < 2 ? (
            <div className="progress-empty">
              <div>⚖️</div>
              <p>Log at least 2 days of weight to see your trend chart.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip content={<WeightTooltip />} />
                <Line
                  type="monotone" dataKey="weight_kg" name="Weight (kg)"
                  stroke="var(--blue)" strokeWidth={2.5}
                  dot={{ r: 4, fill: 'var(--blue)', strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Calorie chart */}
        <div className="card">
          <h2><span className="section-emoji">🔥</span> Calorie Intake</h2>
          {!targets && (
            <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', marginBottom: '1rem', background: 'var(--blue-lt)', padding: '.6rem .875rem', borderRadius: 6 }}>
              💡 <Link to="/" style={{ color: 'var(--blue)', fontWeight: 600 }}>Run the calculator</Link> to see your calorie target line.
            </p>
          )}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '.75rem', marginBottom: '.75rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--green)', display: 'inline-block' }} /> On target
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--amber)', display: 'inline-block' }} /> Off target
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--gray-200)', display: 'inline-block' }} /> Not logged
            </span>
          </div>
          {loading ? (
            <p className="rb-status">Loading…</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={calendarDays} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={range === 7 ? 0 : range === 14 ? 1 : 4} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CalorieTooltip target={targets?.targetCalories} />} />
                {targets?.targetCalories && (
                  <ReferenceLine y={targets.targetCalories} stroke="var(--blue)" strokeDasharray="5 3"
                    label={{ value: 'Target', fill: 'var(--blue)', fontSize: 10, position: 'insideTopRight' }} />
                )}
                <Bar dataKey="calories" radius={[4, 4, 0, 0]}
                  cell={calendarDays.map((entry, i) => (
                    <cell key={i} fill={getBarColor(entry)} />
                  ))}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent weight entries */}
        {weightLogs.length > 0 && (
          <div className="card">
            <h2><span className="section-emoji">📋</span> Recent Weight Entries</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
              {[...weightLogs].reverse().slice(0, 10).map(w => (
                <div key={w.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '.6rem .875rem', border: '1.5px solid var(--gray-200)',
                  borderRadius: 8, fontSize: '.875rem',
                }}>
                  <span style={{ color: 'var(--gray-600)' }}>
                    {new Date(w.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  <span style={{ fontWeight: 700 }}>{w.weight_kg} kg</span>
                  <button onClick={() => handleDelete(w.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: '.9rem' }}>🗑</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </>
  );
}
