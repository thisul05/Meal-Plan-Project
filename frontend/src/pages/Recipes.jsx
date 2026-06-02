import { useState, useEffect } from 'react';
import { fetchRecipes } from '../services/api';
import { getMealImage } from '../utils/mealImage';

const SLOTS = [
  { value: 'all',       label: 'All Meals',  emoji: '🍽️' },
  { value: 'breakfast', label: 'Breakfast',  emoji: '🌅' },
  { value: 'lunch',     label: 'Lunch',      emoji: '☀️'  },
  { value: 'dinner',    label: 'Dinner',     emoji: '🌙' },
  { value: 'snack',     label: 'Snack',      emoji: '🥨' },
];

const SLOT_COLORS = {
  breakfast: { bg: 'var(--amber-lt)', color: 'var(--amber)' },
  lunch:     { bg: 'var(--blue-lt)',  color: 'var(--blue)'  },
  dinner:    { bg: 'var(--purple-lt)',color: 'var(--purple)' },
  snack:     { bg: 'var(--green-lt)', color: 'var(--green)'  },
};

function RecipeCard({ recipe }) {
  const [expanded, setExpanded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const primarySlot = ['breakfast', 'lunch', 'dinner', 'snack']
    .find(s => recipe.tags?.includes(s)) || 'breakfast';
  const imgSrc = getMealImage(recipe.name, primarySlot);
  const slots   = ['breakfast', 'lunch', 'dinner', 'snack'].filter(s => recipe.tags?.includes(s));

  return (
    <div className="rb-card">
      <div className="rb-img-wrap">
        {!imgFailed ? (
          <img src={imgSrc} alt={recipe.name} className="rb-img" onError={() => setImgFailed(true)} />
        ) : (
          <div className="rb-img-fallback">🍽️</div>
        )}
      </div>

      <div className="rb-body">
        <div className="rb-badges">
          {slots.map(s => (
            <span key={s} className="rb-slot-badge"
              style={{ background: SLOT_COLORS[s]?.bg, color: SLOT_COLORS[s]?.color }}>
              {s}
            </span>
          ))}
          <span className="rb-country-badge">
            {recipe.country === 'Sri Lanka' ? '🇱🇰' : '🌍'} {recipe.country}
          </span>
        </div>

        <div className="rb-name">{recipe.name}</div>

        <div className="rb-macros">
          <span className="rb-kcal">🔥 {recipe.calories} kcal</span>
          <span>P {recipe.protein}g</span>
          <span>C {recipe.carbs}g</span>
          <span>F {recipe.fat}g</span>
        </div>

        <button className="recipe-toggle" onClick={() => setExpanded(e => !e)}>
          {expanded ? '▲ Hide recipe' : '▼ Ingredients & steps'}
        </button>

        {expanded && (
          <div className="recipe-details">
            <h4>Ingredients</h4>
            <ul>{(recipe.ingredients || []).map((item, i) => <li key={i}>{item}</li>)}</ul>
            <h4>Steps</h4>
            <ol>{(recipe.steps || []).map((step, i) => <li key={i}>{step}</li>)}</ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Recipes() {
  const [recipes,       setRecipes]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [activeSlot,    setActiveSlot]    = useState('all');
  const [activeCountry, setActiveCountry] = useState('all');
  const [search,        setSearch]        = useState('');

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = recipes
    .filter(r => activeSlot    === 'all' || r.tags?.includes(activeSlot))
    .filter(r => activeCountry === 'all' || r.country === activeCountry)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <header className="app-header" style={{ minHeight: '200px' }}>
        <div className="header-content">
          <div className="header-badge">🍽️ Recipe Library</div>
          <h1>Browse All Recipes</h1>
          <p>Explore our full collection · filter by meal · search by name</p>
        </div>
      </header>

      <main className="page">
        <div className="card">

          <input
            type="text"
            className="rb-search"
            placeholder="🔍  Search recipes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="rb-tabs">
            {SLOTS.map(({ value, label, emoji }) => (
              <button
                key={value}
                className={`rb-tab ${activeSlot === value ? 'active' : ''}`}
                onClick={() => setActiveSlot(value)}
              >
                {emoji} {label}
              </button>
            ))}
          </div>

          <div className="rb-country-tabs">
            {[
              ['all',           '🌐 All Cuisines'],
              ['International', '🌍 International'],
              ['Sri Lanka',     '🇱🇰 Sri Lankan'],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`rb-country-tab ${activeCountry === val ? 'active' : ''}`}
                onClick={() => setActiveCountry(val)}
              >
                {label}
              </button>
            ))}
          </div>

          {loading && <p className="rb-status">Loading recipes…</p>}
          {error   && <p className="rb-status" style={{ color: 'var(--red)' }}>⚠️ {error}</p>}

          {!loading && !error && (
            <>
              <p className="rb-count">
                {filtered.length} recipe{filtered.length !== 1 ? 's' : ''}
              </p>
              {filtered.length === 0 ? (
                <p className="rb-status">No recipes match your filters.</p>
              ) : (
                <div className="rb-grid">
                  {filtered.map(r => <RecipeCard key={r.id} recipe={r} />)}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </>
  );
}
