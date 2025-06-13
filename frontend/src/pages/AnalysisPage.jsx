
import React from 'react';
import ToolSelector from '../ToolSelector';
import SignalDetails from './SignalDetails';

const AnalysisPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🔍 تحليل التوصية المحددة</h2>
      <SignalDetails />
      <ToolSelector />
    </div>
  );
};

export default AnalysisPage;
