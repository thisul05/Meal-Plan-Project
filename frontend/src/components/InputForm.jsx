import { useState } from 'react';
import { validateProfileForm, hasErrors } from '../utils/validation';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary',   label: '🪑  Sedentary — desk job, no exercise' },
  { value: 'light',       label: '🚶  Light — exercise 1–3 days/week' },
  { value: 'moderate',    label: '🏃  Moderate — exercise 3–5 days/week' },
  { value: 'active',      label: '💪  Active — exercise 6–7 days/week' },
  { value: 'very_active', label: '🔥  Very Active — physical job + daily training' },
];

const GOALS = [
  { value: 'lose',     label: '📉 Lose Weight' },
  { value: 'maintain', label: '⚖️ Maintain' },
  { value: 'gain',     label: '📈 Gain Weight' },
];

const EMPTY = { age: '', weight: '', height: '', sex: '', activityLevel: '', goal: '' };

function InputForm({ onSubmit, loading }) {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleGoal(value) {
    setForm(prev => ({ ...prev, goal: value }));
    if (errors.goal) setErrors(prev => ({ ...prev, goal: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const parsed = { ...form, age: parseInt(form.age, 10), weight: parseFloat(form.weight), height: parseFloat(form.height) };
    const errs = validateProfileForm(parsed);
    if (hasErrors(errs)) { setErrors(errs); return; }
    onSubmit(parsed);
  }

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2><span className="section-emoji">👤</span> Your Profile</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="age">Age (years)</label>
          <input id="age" name="age" type="number" min="10" max="120"
            value={form.age} onChange={handleChange}
            className={errors.age ? 'has-error' : ''} placeholder="e.g. 28" />
          {errors.age && <span className="field-error">{errors.age}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input id="weight" name="weight" type="number" min="20" max="300" step="0.1"
            value={form.weight} onChange={handleChange}
            className={errors.weight ? 'has-error' : ''} placeholder="e.g. 75" />
          {errors.weight && <span className="field-error">{errors.weight}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="height">Height (cm)</label>
          <input id="height" name="height" type="number" min="50" max="280" step="0.1"
            value={form.height} onChange={handleChange}
            className={errors.height ? 'has-error' : ''} placeholder="e.g. 175" />
          {errors.height && <span className="field-error">{errors.height}</span>}
        </div>
        <div className="form-group">
          <label>Sex</label>
          <div className="radio-group">
            {['male', 'female'].map(s => (
              <label key={s}>
                <input type="radio" name="sex" value={s} checked={form.sex === s} onChange={handleChange} />
                {s === 'male' ? '♂ Male' : '♀ Female'}
              </label>
            ))}
          </div>
          {errors.sex && <span className="field-error">{errors.sex}</span>}
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label htmlFor="activityLevel">Activity Level</label>
        <select id="activityLevel" name="activityLevel"
          value={form.activityLevel} onChange={handleChange}
          className={errors.activityLevel ? 'has-error' : ''}>
          <option value="">Select your activity level…</option>
          {ACTIVITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {errors.activityLevel && <span className="field-error">{errors.activityLevel}</span>}
      </div>

      <div className="form-group">
        <label>Goal</label>
        <div className="segment-group">
          {GOALS.map(g => (
            <button key={g.value} type="button"
              className={form.goal === g.value ? 'active' : ''}
              onClick={() => handleGoal(g.value)}>
              {g.label}
            </button>
          ))}
        </div>
        {errors.goal && <span className="field-error">{errors.goal}</span>}
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? '⏳ Calculating…' : '🚀 Calculate My Nutrition'}
      </button>
    </form>
  );
}

export default InputForm;
