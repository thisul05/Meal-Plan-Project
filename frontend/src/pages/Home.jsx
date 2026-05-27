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
            ) : (
              <div style={{ textAlign: 'center', marginTop: '-.5rem', marginBottom: '1.25rem', color: 'var(--gray-600)', fontSize: '.875rem' }}>
                <Link to="/login" style={{ color: 'var(--blue)', fontWeight: 700 }}>Log in</Link> or{' '}
                <Link to="/register" style={{ color: 'var(--blue)', fontWeight: 700 }}>sign up</Link> to save this plan.
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Home;
