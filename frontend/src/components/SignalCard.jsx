import React from 'react';

const SignalCard = ({ signal }) => {
  return (
    <div className="signal-card">
      <h3>{signal.symbol}</h3>
      <p>{signal.action}</p>
    </div>
  );
};

export default SignalCard;