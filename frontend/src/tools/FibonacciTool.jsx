
import React, { useEffect } from 'react';
import { useSignalContext } from '../context/SignalContext';

const FibonacciTool = () => {
  const { selectedSignal } = useSignalContext();

  useEffect(() => {
    if (selectedSignal) {
      console.log("📏 تحليل فيبوناتشي لـ:", selectedSignal.symbol);
    }
  }, [selectedSignal]);

  return <div>🟡 أداة Fibonacci Tool مفعّلة</div>;
};

export default FibonacciTool;
