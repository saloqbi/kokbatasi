
import React, { useEffect } from 'react';
import { useSignalContext } from '../context/SignalContext';

const TrendlineTool = () => {
  const { selectedSignal } = useSignalContext();

  useEffect(() => {
    if (selectedSignal) {
      console.log("📈 رسم خط اتجاه لـ:", selectedSignal.symbol);
    }
  }, [selectedSignal]);

  return <div>🟢 أداة Trendline Tool مفعّلة</div>;
};

export default TrendlineTool;
