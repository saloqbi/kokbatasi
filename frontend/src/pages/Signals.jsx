import React from 'react';
import SignalCard from '../components/SignalCard';
import FilterBar from '../components/FilterBar';

const mockSignals = [
  { _id: '1', symbol: 'AAPL', action: 'Buy' },
  { _id: '2', symbol: 'TSLA', action: 'Sell' }
];

const Signals = () => {
  return (
    <div>
      <h2>📡 Signals</h2>
      <FilterBar onFilter={() => {}} />
      {mockSignals.map(signal => (
        <SignalCard key={signal._id} signal={signal} />
      ))}
    </div>
  );
};

export default Signals;