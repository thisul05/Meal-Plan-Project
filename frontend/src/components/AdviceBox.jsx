function AdviceBox({ advice }) {
  if (!advice || advice.length === 0) return null;

  return (
    <div className="card">
      <h2><span className="section-emoji">💡</span> Personalised Guidance</h2>
      <ul className="advice-list">
        {advice.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    </div>
  );
}

export default AdviceBox;
