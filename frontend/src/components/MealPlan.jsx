import { useState } from 'react';

const SLOT_FALLBACK = {
  breakfast: 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=120&h=120&fit=crop',
  lunch:     'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop',
  dinner:    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&h=120&fit=crop',
  snack:     'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=120&h=120&fit=crop',
};

const KEYWORD_IMAGES = [
  ['salmon',              'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&h=120&fit=crop'],
  ['cod',                 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&h=120&fit=crop'],
  ['fish',                'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=120&h=120&fit=crop'],
  ['chicken',             'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=120&h=120&fit=crop'],
  ['beef',                'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&h=120&fit=crop'],
  ['steak',               'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=120&h=120&fit=crop'],
  ['turkey',              'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=120&h=120&fit=crop'],
  ['egg',                 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=120&h=120&fit=crop'],
  ['frittata',            'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=120&h=120&fit=crop'],
  ['smoothie',            'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=120&h=120&fit=crop'],
  ['oat',                 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=120&h=120&fit=crop'],
  ['yogurt',              'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&h=120&fit=crop'],
  ['parfait',             'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&h=120&fit=crop'],
  ['salad',               'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=120&h=120&fit=crop'],
  ['pasta',               'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=120&h=120&fit=crop'],
  ['bolognese',           'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=120&h=120&fit=crop'],
  ['soup',                'https://images.unsplash.com/photo-1547592180-85f173990554?w=120&h=120&fit=crop'],
  ['lentil',              'https://images.unsplash.com/photo-1547592180-85f173990554?w=120&h=120&fit=crop'],
  ['rice',                'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop'],
  ['curry',               'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop'],
  ['biryani',             'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=120&h=120&fit=crop'],
  ['wrap',                'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&h=120&fit=crop'],
  ['sandwich',            'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&h=120&fit=crop'],
  ['taco',                'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&h=120&fit=crop'],
  ['hummus',              'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=120&h=120&fit=crop'],
  ['avocado',             'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=120&h=120&fit=crop'],
  ['toast',               'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=120&h=120&fit=crop'],
  ['apple',               'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=120&h=120&fit=crop'],
  ['fruit',               'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=120&h=120&fit=crop'],
  ['nut',                 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=120&h=120&fit=crop'],
  ['almond',              'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=120&h=120&fit=crop'],
  ['cottage',             'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=120&h=120&fit=crop'],
  ['pineapple',           'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=120&h=120&fit=crop'],
  ['hopper',              'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop'],
  ['pittu',               'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop'],
  ['kiribath',            'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=120&h=120&fit=crop'],
  ['kottu',               'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop'],
  ['roti',                'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&h=120&fit=crop'],
  ['pol pani',            'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=120&h=120&fit=crop'],
  ['thala',               'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=120&h=120&fit=crop'],
];

function getMealImage(name, slot) {
  const n = name.toLowerCase();
  for (const [kw, url] of KEYWORD_IMAGES) {
    if (n.includes(kw)) return url;
  }
  return SLOT_FALLBACK[slot] || SLOT_FALLBACK.breakfast;
}

function MealCard({ meal }) {
  const [expanded, setExpanded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const imgSrc = getMealImage(meal.name, meal.slot);

  return (
    <div className={`meal-card ${meal.slot}`}>
      <div className="meal-card-header">
        <div className="meal-img-wrap">
          {!imgFailed ? (
            <img
              src={imgSrc}
              alt={meal.name}
              className="meal-img"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="meal-img-fallback">🍽️</div>
          )}
        </div>
        <div className="meal-info">
          <span className="meal-slot-badge">{meal.slot}</span>
          <div className="meal-name">{meal.name}</div>
          <div className="meal-macros-row">
            <span className="kcal">🔥 {meal.calories} kcal</span>
            <span>P {meal.protein}g</span>
            <span>C {meal.carbs}g</span>
            <span>F {meal.fat}g</span>
          </div>
        </div>
      </div>

      <button className="recipe-toggle" onClick={() => setExpanded(e => !e)}>
        {expanded ? '▲ Hide recipe' : '▼ View ingredients & steps'}
      </button>

      {expanded && (
        <div className="recipe-details">
          <h4>Ingredients</h4>
          <ul>
            {(meal.ingredients || []).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h4>Steps</h4>
          <ol>
            {(meal.steps || []).map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function MealPlan({ plan }) {
  const { meals, totals, targets, withinTolerance, warning } = plan;

  const ORDER = ['breakfast', 'lunch', 'dinner', 'snack'];
  const sorted = [...meals].sort(
    (a, b) => ORDER.indexOf(a.slot) - ORDER.indexOf(b.slot)
  );

  const calorieDiff = totals.calories - targets.calories;
  const diffLabel = calorieDiff === 0 ? '' : calorieDiff > 0 ? `+${calorieDiff}` : `${calorieDiff}`;

  return (
    <div className="card">
      <h2><span className="section-emoji">🍽️</span> Today's Meal Plan</h2>

      {warning && (
        <div className="warning-banner">
          <span>⚠️</span> {warning}
        </div>
      )}

      <div className="meals-list">
        {sorted.map((meal, i) => <MealCard key={i} meal={meal} />)}
      </div>

      <div className="plan-summary">
        <div className="plan-summary-row">
          <div className="plan-summary-item">
            <span className="s-label">Total Calories</span>
            <span className={`s-value ${withinTolerance ? 'on-target' : 'off-target'}`}>
              {totals.calories.toLocaleString()} kcal {withinTolerance ? '✓' : diffLabel}
            </span>
          </div>
          <div className="plan-summary-item">
            <span className="s-label">Target</span>
            <span className="s-value">{targets.calories.toLocaleString()} kcal</span>
          </div>
          <div className="plan-summary-item">
            <span className="s-label">Protein</span>
            <span className="s-value" style={{ color: 'var(--blue)' }}>{totals.protein}g</span>
          </div>
          <div className="plan-summary-item">
            <span className="s-label">Carbs</span>
            <span className="s-value" style={{ color: 'var(--green)' }}>{totals.carbs}g</span>
          </div>
          <div className="plan-summary-item">
            <span className="s-label">Fat</span>
            <span className="s-value" style={{ color: 'var(--amber)' }}>{totals.fat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MealPlan;
