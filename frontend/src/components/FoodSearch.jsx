import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchFood, addLog } from '../services/api';

export default function FoodSearch({ date, onLogged }) {
  const { token } = useAuth();
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected]   = useState(null);  // food object being portioned
  const [grams, setGrams]         = useState(100);
  const [slot, setSlot]           = useState('snack');
  const [logging, setLogging]     = useState(false);
  const [error, setError]         = useState('');
  const debounceRef = useRef(null);

  function handleQueryChange(e) {
    const val = e.target.value;
    setQuery(val);
    setError('');
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(() => runSearch(val.trim()), 600);
  }

  async function runSearch(q) {
    setSearching(true);
    setSelected(null);
    try {
      const data = await searchFood(token, q);
      setResults(data);
      if (data.length === 0) setError('No results found. Try a different term.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }

  function selectFood(food) {
    setSelected(food);
    setGrams(100);
    setResults([]);
    setQuery(food.name);
  }

  function scale(per100, g) {
    return Math.round((per100 * g) / 100 * 10) / 10;
  }

  async function handleLog() {
    if (!selected) return;
    const g = parseFloat(grams);
    if (!g || g <= 0) { setError('Enter a valid portion size.'); return; }
    setLogging(true);
    try {
      await addLog(token, {
        name:      selected.name,
        meal_slot: slot,
        date,
        calories:  scale(selected.per100g.calories, g),
        protein:   scale(selected.per100g.protein,  g),
        carbs:     scale(selected.per100g.carbs,    g),
        fat:       scale(selected.per100g.fat,      g),
      });
      setSelected(null);
      setQuery('');
      setGrams(100);
      if (onLogged) onLogged();
    } catch (err) {
      setError(err.message);
    } finally {
      setLogging(false);
    }
  }

  const g = parseFloat(grams) || 0;

  return (
    <div>
      {/* Search input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Search any food (e.g. banana, chicken breast)…"
          value={query}
          onChange={handleQueryChange}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '.65rem .9rem', border: '1.5px solid var(--gray-200)',
            borderRadius: 8, fontSize: '.925rem', outline: 'none',
            background: 'var(--gray-50)',
          }}
        />
        {searching && (
          <span style={{ position: 'absolute', right: '.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '.75rem', color: 'var(--gray-400)' }}>
            Searching…
          </span>
        )}
      </div>

      {error && (
        <p style={{ fontSize: '.8rem', color: 'var(--red)', marginTop: '.4rem' }}>{error}</p>
      )}

      {/* Results dropdown */}
      {results.length > 0 && (
        <div style={{
          border: '1.5px solid var(--gray-200)', borderRadius: 8, marginTop: '.35rem',
          maxHeight: 260, overflowY: 'auto', background: '#fff',
          boxShadow: '0 4px 16px rgba(0,0,0,.08)',
        }}>
          {results.map(food => (
            <button
              key={food.fdcId}
              onClick={() => selectFood(food)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '.65rem 1rem', border: 'none', background: 'none',
                cursor: 'pointer', borderBottom: '1px solid var(--gray-100)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-lt)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{food.name}</div>
              <div style={{ fontSize: '.75rem', color: 'var(--gray-600)', marginTop: '.1rem' }}>
                {food.category && <span>{food.category} · </span>}
                🔥 {food.per100g.calories} kcal · P {food.per100g.protein}g · C {food.per100g.carbs}g · F {food.per100g.fat}g per 100g
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Portion configurator */}
      {selected && (
        <div style={{
          marginTop: '.75rem', padding: '1rem', borderRadius: 8,
          border: '1.5px solid var(--blue)', background: 'var(--blue-lt)',
        }}>
          <div style={{ fontWeight: 700, fontSize: '.95rem', marginBottom: '.65rem' }}>
            {selected.name}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.6rem', marginBottom: '.65rem' }}>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>
              Portion (g)
              <input
                type="number" min="1" max="2000"
                value={grams}
                onChange={e => setGrams(e.target.value)}
                style={{
                  display: 'block', width: '100%', boxSizing: 'border-box',
                  marginTop: '.25rem', padding: '.45rem .65rem',
                  border: '1.5px solid var(--gray-200)', borderRadius: 6,
                  fontSize: '.9rem', background: '#fff',
                }}
              />
            </label>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--gray-600)' }}>
              Meal slot
              <select
                value={slot}
                onChange={e => setSlot(e.target.value)}
                style={{
                  display: 'block', width: '100%', boxSizing: 'border-box',
                  marginTop: '.25rem', padding: '.45rem .65rem',
                  border: '1.5px solid var(--gray-200)', borderRadius: 6,
                  fontSize: '.9rem', background: '#fff',
                }}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </label>
          </div>

          {/* Scaled macros preview */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '.4rem',
            marginBottom: '.75rem',
          }}>
            {[
              { label: 'Calories', val: scale(selected.per100g.calories, g), unit: 'kcal' },
              { label: 'Protein',  val: scale(selected.per100g.protein,  g), unit: 'g' },
              { label: 'Carbs',    val: scale(selected.per100g.carbs,    g), unit: 'g' },
              { label: 'Fat',      val: scale(selected.per100g.fat,      g), unit: 'g' },
            ].map(({ label, val, unit }) => (
              <div key={label} style={{
                background: '#fff', borderRadius: 6, padding: '.4rem .5rem', textAlign: 'center',
                border: '1px solid var(--gray-200)',
              }}>
                <div style={{ fontSize: '.7rem', color: 'var(--gray-600)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: '.95rem', fontWeight: 800 }}>{val}<span style={{ fontSize: '.7rem', fontWeight: 400 }}>{unit}</span></div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button
              onClick={handleLog}
              disabled={logging}
              style={{
                flex: 1, padding: '.55rem', borderRadius: 7, border: 'none',
                background: 'var(--blue)', color: '#fff', fontWeight: 700,
                fontSize: '.9rem', cursor: logging ? 'not-allowed' : 'pointer',
                opacity: logging ? .7 : 1,
              }}
            >
              {logging ? 'Logging…' : '+ Log to Diary'}
            </button>
            <button
              onClick={() => { setSelected(null); setQuery(''); }}
              style={{
                padding: '.55rem .9rem', borderRadius: 7,
                border: '1.5px solid var(--gray-200)', background: '#fff',
                fontWeight: 600, fontSize: '.9rem', cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
