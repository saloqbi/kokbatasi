
import React, { useContext } from 'react';
import { Rect, Text } from 'react-konva';
import { SignalContext } from '../context/SignalContext';

const ICTTool = () => {
  const { selectedSignal } = useContext(SignalContext);
  const zones = [
    { x: 100, y: 150, width: 120, height: 40, label: "Order Block" },
    { x: 250, y: 200, width: 100, height: 30, label: "FVG" }
  ];

  return (
    <>
      {zones.map((z, i) => (
        <React.Fragment key={i}>
          <Rect x={z.x} y={z.y} width={z.width} height={z.height} fill="rgba(255,165,0,0.2)" stroke="orange" />
          <Text x={z.x} y={z.y - 14} text={z.label} fill="orange" fontSize={12} />
        </React.Fragment>
      ))}
    </>
  );
};

export default ICTTool;
