
import React, { useContext } from 'react';
import { Line } from 'react-konva';
import { SignalContext } from '../context/SignalContext';

const SupportResistanceTool = () => {
  const { selectedSignal } = useContext(SignalContext);
  if (!selectedSignal) return null;

  return (
    <>
      <Line points={[50, 100, 300, 100]} stroke="green" strokeWidth={2} />
      <Line points={[50, 200, 300, 200]} stroke="red" strokeWidth={2} />
    </>
  );
};

export default SupportResistanceTool;
