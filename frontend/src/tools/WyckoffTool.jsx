
import React, { useContext } from 'react';
import { Line, Text } from 'react-konva';
import { SignalContext } from '../context/SignalContext';

const WyckoffTool = () => {
  const { selectedSignal } = useContext(SignalContext);

  const phases = [
    { label: "Accumulation", points: [100, 300, 150, 260, 200, 280] },
    { label: "Markup", points: [200, 280, 250, 240, 300, 210] }
  ];

  if (!selectedSignal) return null;

  return (
    <>
      {phases.map((p, i) => (
        <React.Fragment key={i}>
          <Line points={p.points} stroke="brown" strokeWidth={2} />
          <Text x={p.points[0]} y={p.points[1] - 20} text={p.label} fill="brown" fontSize={12} />
        </React.Fragment>
      ))}
    </>
  );
};

export default WyckoffTool;
