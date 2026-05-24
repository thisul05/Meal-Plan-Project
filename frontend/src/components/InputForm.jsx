import { useState } from 'react';
import { validateProfileForm, hasErrors } from '../utils/validation';

const ACTIVITY_CARDS = [
  {
    value: 'sedentary',
    emoji: '🛋️',
    title: 'Sedentary',
    desc: 'Desk job',
    detail: 'Little or no exercise',
  },
  {
    value: 'light',
    emoji: '🚶',
    title: 'Lightly Active',
    desc: '1–3×/week',
    detail: 'Walking or light gym',
  },
  {
    value: 'moderate',
    emoji: '🏃',
    title: 'Moderate',
    desc: '3–5×/week',
    detail: 'Gym or sport regularly',
  },
  {
    value: 'active',
    emoji: '💪',
    title: 'Very Active',
    desc: '6–7×/week',
    detail: 'Hard daily training',
  },
  {
    value: 'very_active',
    emoji: '🔥',
    title: 'Athlete',
    desc: 'Twice/day',
    detail: 'Physical job + gym',
  },
];

const GOALS = [
  { value: 'lose',     label: '📉 Lose Weight' },
  { value: 'maintain', label: '⚖️ Maintain' },
  { value: 'gain',     label: '📈 Gain Weight' },
];

const COUNTRIES = [
  { value: 'all',       flag: '🌍', name: 'International', desc: 'All cuisines' },
  { value: 'Sri Lanka', flag: '🇱🇰', name: 'Sri Lanka',     desc: 'Sri Lankan food' },
];

const EMPTY = { age: '', weight: '', height: '', sex: '', activityLevel: '', goal: '', country: 'all' };

export default function InputForm({ onSubmit, loading }) {
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function handleActivity(value) {
    setForm(prev => ({ ...prev, activityLevel: value }));
    if (errors.activityLevel) setErrors(prev => ({ ...prev, activityLevel: undefined }));
  }

  function handleGoal(value) {
    setForm(prev => ({ ...prev, goal: value }));
    if (errors.goal) setErrors(prev => ({ ...prev, goal: undefined }));
  }

  function handleCountry(value) {
    setForm(prev => ({ ...prev, country: value }));
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

      {/* Age / Weight */}
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

      {/* Height / Sex */}
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

      {/* Activity Level — visual cards */}
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '.6rem' }}>Activity Level</label>
        <div className="activity-grid">
          {ACTIVITY_CARDS.map(card => (
            <button
              key={card.value}
              type="button"
              className={`activity-card${form.activityLevel === card.value ? ' active' : ''}`}
              onClick={() => handleActivity(card.value)}
            >
              <span className="ac-emoji">{card.emoji}</span>
              <span className="ac-title">{card.title}</span>
              <span className="ac-desc">{card.desc}</span>
              <span className="ac-detail">{card.detail}</span>
            </button>
          ))}
        </div>
        {errors.activityLevel && <span className="field-error" style={{ marginTop: '.35rem', display: 'block' }}>{errors.activityLevel}</span>}
      </div>

      {/* Goal */}
      <div className="form-group" style={{ marginBottom: '1rem' }}>
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

      {/* Cuisine / Country */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', marginBottom: '.6rem' }}>
          Cuisine Preference
          <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--gray-400)', marginLeft: '.4rem', fontSize: '.7rem' }}>
            — filters the meal plan to foods from that country
          </span>
        </label>
        <div className="country-grid">
          {COUNTRIES.map(c => (
            <button
              key={c.value}
              type="button"
              className={`country-card${form.country === c.value ? ' active' : ''}`}
              onClick={() => handleCountry(c.value)}
            >
              <span className="cc-flag">{c.flag}</span>
              <span className="cc-name">{c.name}</span>
              <span className="cc-desc">{c.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? '⏳ Calculating…' : '🚀 Calculate My Nutrition'}
      </button>
    </form>
  );
}
