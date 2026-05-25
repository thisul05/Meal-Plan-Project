const BMI_CONFIG = {
  danger:  { icon: '🔴', color: 'var(--red)',   bg: 'var(--red-lt)',    border: '#fca5a5' },
  warning: { icon: '⚠️',  color: 'var(--amber)', bg: 'var(--amber-lt)', border: '#fcd34d' },
  success: { icon: '✅',  color: 'var(--green)', bg: 'var(--green-lt)', border: '#86efac' },
};

function TipList({ tips, accent }) {
  return (
    <ul className="advice-list">
      {tips.map((tip, i) => (
        <li key={i} style={{ borderLeftColor: accent }}>{tip}</li>
      ))}
    </ul>
  );
}

function AdviceBox({ advice }) {
  if (!advice) return null;

  // Legacy flat-array format (backward compat)
  if (Array.isArray(advice)) {
    if (advice.length === 0) return null;
    return (
      <div className="card">
        <h2><span className="section-emoji">💡</span> Personalised Guidance</h2>
        <TipList tips={advice} accent="var(--green)" />
      </div>
    );
  }

  const { bmiAlert, goalTips, ageTips } = advice;
  const bmiCfg = bmiAlert ? BMI_CONFIG[bmiAlert.type] : null;

  return (
    <div className="card advice-card">
      <h2><span className="section-emoji">💡</span> Personalised Guidance</h2>

      {/* BMI alert section */}
      {bmiAlert && bmiCfg && (
        <div className="advice-section advice-bmi" style={{
          background: bmiCfg.bg,
          border: `1.5px solid ${bmiCfg.border}`,
        }}>
          <div className="advice-section-header">
            <span className="advice-section-icon">{bmiCfg.icon}</span>
            <span className="advice-section-title" style={{ color: bmiCfg.color }}>
              {bmiAlert.headline}
            </span>
          </div>
          <TipList tips={bmiAlert.tips} accent={bmiCfg.color} />
        </div>
      )}

      {/* Goal tips */}
      {goalTips && goalTips.length > 0 && (
        <div className="advice-section">
          <div className="advice-section-header">
            <span className="advice-section-icon">🎯</span>
            <span className="advice-section-title">Goal Strategy</span>
          </div>
          <TipList tips={goalTips} accent="var(--blue)" />
        </div>
      )}

      {/* Age-specific motivation */}
      {ageTips && (
        <div className="advice-section advice-motivation">
          <div className="advice-section-header">
            <span className="advice-section-icon">💪</span>
            <span className="advice-section-title advice-motivation-title">
              {ageTips.headline}
            </span>
          </div>
          <TipList tips={ageTips.tips} accent="var(--purple)" />
        </div>
      )}
    </div>
  );
}

export default AdviceBox;
