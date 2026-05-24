import { useState } from 'react';

function getMealEmoji(name) {
  const n = name.toLowerCase();
  if (n.includes('salmon'))                    return '🐟';
  if (n.includes('cod') || n.includes('fish')) return '🐠';
  if (n.includes('chicken'))                   return '🍗';
  if (n.includes('beef') || n.includes('steak'))return '🥩';
  if (n.includes('turkey'))                    return '🦃';
  if (n.includes('egg'))                       return '🥚';
  if (n.includes('smoothie'))                  return '🥤';
  if (n.includes('salad'))                     return '🥗';
  if (n.includes('soup') || n.includes('lentil')) return '🍲';
  if (n.includes('pasta') || n.includes('bolognese')) return '🍝';
  if (n.includes('taco'))                      return '🌮';
  if (n.includes('rice') || n.includes('curry')) return '🍛';
  if (n.includes('oat'))                       return '🥣';
  if (n.includes('yogurt') || n.includes('parfait')) return '🍨';
  if (n.includes('toast') || n.includes('avocado')) return '🥑';
  if (n.includes('sandwich') || n.includes('wrap')) return '🥪';
  if (n.includes('hopper'))                    return '🥞';
  if (n.includes('roti') || n.includes('kottu')) return '🫓';
  if (n.includes('hummus'))                    return '🫙';
  if (n.includes('apple') || n.includes('fruit')) return '🍎';
  if (n.includes('cottage') || n.includes('pineapple')) return '🍍';
  if (n.includes('nut') || n.includes('almond')) return '🥜';
  if (n.includes('frittata'))                  return '🍳';
  if (n.includes('string hopper'))             return '🍜';
  return '🍽️';
}

function MealCard({ meal }) {
  const [expanded, setExpanded] = useState(false);
  const emoji = getMealEmoji(meal.name);

  return (
    <div className={`meal-card ${meal.slot}`}>
      <div className="meal-card-header">
        <div className="meal-emoji">{emoji}</div>
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
