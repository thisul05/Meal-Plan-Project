function ResultsCard({ result }) {
  const { bmr, tdee, bmi, bmiCategory, targetCalories, macros } = result;

  return (
    <div className="card">
      <h2><span className="section-emoji">📊</span> Your Results</h2>

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-label">BMR</div>
          <div className="stat-value">{bmr.toLocaleString()}</div>
          <div className="stat-unit">kcal at rest</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">TDEE</div>
          <div className="stat-value">{tdee.toLocaleString()}</div>
          <div className="stat-unit">kcal with activity</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">BMI</div>
          <div className="stat-value">{bmi}</div>
          <div className="stat-unit">
            <span className={`bmi-badge ${bmiCategory}`}>{bmiCategory}</span>
          </div>
        </div>
      </div>

      <div className="target-box">
        <div className="target-label">🎯 Daily Calorie Target</div>
        <div className="target-value">
          {targetCalories.toLocaleString()}
          <span className="target-unit"> kcal / day</span>
        </div>
      </div>

      <div className="macro-grid">
        {[
          { key: 'protein', label: 'Protein', emoji: '🥩', data: macros.protein },
          { key: 'fat',     label: 'Fat',     emoji: '🥑', data: macros.fat },
          { key: 'carbs',   label: 'Carbs',   emoji: '🌾', data: macros.carbs },
        ].map(({ key, label, emoji, data }) => (
          <div key={key} className={`macro-card ${key}`}>
            <div className="macro-name">{emoji} {label}</div>
            <div className="macro-grams">{data.grams}<span className="macro-g">g</span></div>
            <div className="macro-percent">{data.percent}% of calories</div>
            <div className="macro-bar">
              <div className="macro-bar-fill" style={{ width: `${data.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsCard;
