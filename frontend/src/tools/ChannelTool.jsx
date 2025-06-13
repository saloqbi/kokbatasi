
import React, { useEffect, useContext } from 'react';
import { Line } from 'react-konva';
import { SignalContext } from '../context/SignalContext';

const ChannelTool = () => {
  const { selectedSignal } = useContext(SignalContext);

  useEffect(() => {
    if (selectedSignal) {
      console.log("📊 Channel Tool active for", selectedSignal.symbol);
    }
  }, [selectedSignal]);

  return (
    <>
      <Line points={[50, 200, 300, 100]} stroke="teal" strokeWidth={2} />
      <Line points={[50, 250, 300, 150]} stroke="teal" strokeWidth={2} />
    </>
  );
};

export default ChannelTool;
