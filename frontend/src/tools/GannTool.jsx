
import React, { useEffect } from 'react';
import { useSignalContext } from '../context/SignalContext';

const GannTool = () => {
  const { selectedSignal } = useSignalContext();

  useEffect(() => {
    if (selectedSignal) {
      console.log("🧭 تحليل Gann لـ:", selectedSignal.symbol);
    }
  }, [selectedSignal]);

  return <div>🔵 أداة Gann Tool مفعّلة</div>;
};

export default GannTool;
