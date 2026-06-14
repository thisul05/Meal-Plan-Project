import { useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateNutrition, generateMealPlan, savePlan, addBulkLogs } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Disclaimer  from '../components/Disclaimer';
import InputForm   from '../components/InputForm';
import ResultsCard from '../components/ResultsCard';
import AdviceBox   from '../components/AdviceBox';
import MealPlan    from '../components/MealPlan';

function Home() {
  const { user, token } = useAuth();

  const [nutritionResult, setNutritionResult] = useState(null);
  const [country, setCountry]                 = useState('all');
  const [age, setAge]                         = useState(null);
  const [mealPlan, setMealPlan]               = useState(null);
  const [calcLoading, setCalcLoading]         = useState(false);
  const [planLoading, setPlanLoading]         = useState(false);
  const [saveLoading, setSaveLoading]         = useState(false);
  const [logLoading, setLogLoading]           = useState(false);
  const [error, setError]                     = useState(null);
  const [savedMsg, setSavedMsg]               = useState('');
  const [loggedMsg, setLoggedMsg]             = useState('');
  const [macroForm,   setMacroForm]           = useState(null);
  const [macroMsg,    setMacroMsg]            = useState('');

  async function handleCalculate(profileData) {
    setCalcLoading(true);
    setError(null);
    setMealPlan(null);
    setSavedMsg('');
    try {
      const result = await calculateNutrition(profileData);
      setNutritionResult(result);
      setCountry(profileData.country || 'all');
      setAge(profileData.age);
      localStorage.setItem('nutritionTargets', JSON.stringify(result));
      localStorage.removeItem('macroPreferences');
      setMacroForm({
        calories: result.targetCalories,
        protein:  result.macros.protein.grams,
        carbs:    result.macros.carbs.grams,
        fat:      result.macros.fat.grams,
      });
      setMacroMsg('');
    } catch (err) {
      setError(err.message);
    } finally {
      setCalcLoading(false);
    }
  }

  async function handleGeneratePlan() {
    setPlanLoading(true);
    setError(null);
    setSavedMsg('');
    try {
      const plan = await generateMealPlan(nutritionResult.targetCalories, nutritionResult.macros, country, age);
      setMealPlan(plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlanLoading(false);
    }
  }

  async function handleSavePlan() {
    setSaveLoading(true);
    setSavedMsg('');
    try {
      await savePlan(mealPlan, token);
      setSavedMsg('✅ Plan saved! View it in My Plans.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaveLoading(false);
    }
  }

  async function handleLogAll() {
    setLogLoading(true);
    setLoggedMsg('');
    try {
      const meals = mealPlan.meals.map(m => ({
        recipe_id: m.id,
        meal_slot: m.slot,
        name:      m.name,
        calories:  m.calories,
        protein:   m.protein,
        carbs:     m.carbs,
        fat:       m.fat,
      }));
      await addBulkLogs(token, meals);
      setLoggedMsg('✅ All meals logged to your diary!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLogLoading(false);
    }
  }

  return (
    <>
      <header className="app-header">
        <div className="header-deco" aria-hidden="true">
          <span style={{top:'12%',  left:'6%',  fontSize:'2.4rem', animationDelay:'0s'}}>🥗</span>
          <span style={{top:'65%',  left:'4%',  fontSize:'1.8rem', animationDelay:'1.2s'}}>🍎</span>
          <span style={{top:'20%',  left:'18%', fontSize:'1.5rem', animationDelay:'2.1s'}}>🥦</span>
          <span style={{top:'75%',  left:'22%', fontSize:'2rem',   animationDelay:'0.6s'}}>🍋</span>
          <span style={{top:'10%',  right:'7%', fontSize:'2.2rem', animationDelay:'1.8s'}}>🍇</span>
          <span style={{top:'60%',  right:'5%', fontSize:'1.7rem', animationDelay:'0.3s'}}>🥕</span>
          <span style={{top:'30%',  right:'17%',fontSize:'1.6rem', animationDelay:'2.5s'}}>🫐</span>
          <span style={{top:'80%',  right:'22%',fontSize:'1.9rem', animationDelay:'1s'}}>🥑</span>
          <span style={{top:'45%',  left:'10%', fontSize:'1.4rem', animationDelay:'3s'}}>🌾</span>
          <span style={{top:'50%',  right:'11%',fontSize:'1.4rem', animationDelay:'1.5s'}}>🍊</span>
        </div>
        <div className="header-content">
          <div className="header-badge">🥗 Personalised Nutrition</div>
          <h1>Nutrition &amp; Meal Planner</h1>
          <p>Calculate your BMR · TDEE · BMI · Macros and get a personalised daily meal plan</p>
        </div>
      </header>

      <main className="page">
        <Disclaimer />
        <InputForm onSubmit={handleCalculate} loading={calcLoading} />

        {error && <div className="error-banner">⚠️ {error}</div>}

        {nutritionResult && (
          <>
            <ResultsCard result={nutritionResult} />

            {/* Macro customizer */}
            {macroForm && (
              <div className="card">
                <h2><span className="section-emoji">⚙️</span> Adjust Your Macro Targets</h2>
                <p style={{ fontSize: '.82rem', color: 'var(--gray-600)', marginBottom: '1.1rem' }}>
                  These are your calculated targets. Tweak any value and save — your Progress tracker will use the updated numbers.
                </p>
                <form onSubmit={e => {
                  e.preventDefault();
                  const cal  = parseInt(macroForm.calories);
                  const prot = parseInt(macroForm.protein);
                  const carb = parseInt(macroForm.carbs);
                  const fat  = parseInt(macroForm.fat);
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
                  setMacroMsg('✅ Custom targets saved!');
                  setTimeout(() => setMacroMsg(''), 2500);
                }}>
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
                          value={macroForm[key]}
                          onChange={e => setMacroForm(f => ({ ...f, [key]: e.target.value }))}
                          style={{ width: '100%', padding: '.55rem .75rem', border: '1.5px solid var(--gray-200)', borderRadius: 8, fontSize: '.9rem', fontWeight: 600, boxSizing: 'border-box' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button type="submit" className="btn-secondary" style={{ padding: '.6rem 1.4rem', fontSize: '.875rem' }}>
                      💾 Save Custom Targets
                    </button>
                    <button type="button"
                      onClick={() => {
                        localStorage.removeItem('macroPreferences');
                        setMacroForm({
                          calories: nutritionResult.targetCalories,
                          protein:  nutritionResult.macros.protein.grams,
                          carbs:    nutritionResult.macros.carbs.grams,
                          fat:      nutritionResult.macros.fat.grams,
                        });
                        setMacroMsg('↩ Reset to calculated values.');
                        setTimeout(() => setMacroMsg(''), 2500);
                      }}
                      style={{ background: 'none', border: '1.5px solid var(--gray-300)', borderRadius: 8, padding: '.55rem 1.1rem', cursor: 'pointer', fontSize: '.875rem', fontWeight: 600, color: 'var(--gray-600)', fontFamily: 'inherit' }}>
                      ↩ Reset to Calculated
                    </button>
                  </div>
                  {macroMsg && <p style={{ marginTop: '.6rem', fontSize: '.85rem', color: macroMsg.startsWith('✅') ? 'var(--green)' : 'var(--gray-600)' }}>{macroMsg}</p>}
                </form>
              </div>
            )}

            <AdviceBox advice={nutritionResult.advice} />
            <button className="btn-secondary" onClick={handleGeneratePlan} disabled={planLoading}>
              {planLoading ? '⏳ Building your meal plan…' : '🍽 Generate My Meal Plan'}
            </button>
          </>
        )}

        {mealPlan && (
          <>
            <MealPlan plan={mealPlan} />

            {user ? (
              <div style={{ textAlign: 'center', marginTop: '-.5rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.6rem' }}>
                {savedMsg  && <p style={{ color: 'var(--green)', fontWeight: 600 }}>{savedMsg}</p>}
                {loggedMsg && <p style={{ color: 'var(--green)', fontWeight: 600 }}>{loggedMsg}</p>}
                <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {!savedMsg && (
                    <button onClick={handleSavePlan} disabled={saveLoading}
                      style={{ background: 'var(--blue-lt)', border: '2px solid var(--blue)', color: 'var(--blue)', borderRadius: 8, padding: '.6rem 1.25rem', cursor: 'pointer', fontWeight: 700, fontSize: '.875rem', fontFamily: 'inherit' }}>
                      {saveLoading ? 'Saving…' : '💾 Save Plan'}
                    </button>
                  )}
                  {!loggedMsg && (
                    <button onClick={handleLogAll} disabled={logLoading}
                      style={{ background: 'var(--green-lt)', border: '2px solid var(--green)', color: 'var(--green)', borderRadius: 8, padding: '.6rem 1.25rem', cursor: 'pointer', fontWeight: 700, fontSize: '.875rem', fontFamily: 'inherit' }}>
                      {logLoading ? 'Logging…' : '📓 Log All Meals to Diary'}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </>
        )}
      </main>
    </>
  );
}

export default Home;
