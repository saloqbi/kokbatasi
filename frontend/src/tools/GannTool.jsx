import React, { useContext } from "react";
import { Line } from "react-konva";
import { SignalContext } from "../context/SignalContext";

const GannTool = () => {
  const { selectedSignal } = useContext(SignalContext);

  if (!selectedSignal) return null;

  const lines = [];
  for (let i = 0; i <= 5; i++) {
    lines.push(
      <Line key={`v-${i}`} points={[100 + i * 20, 100, 100 + i * 20, 200]} stroke="blue" strokeWidth={1} />,
      <Line key={`h-${i}`} points={[100, 100 + i * 20, 200, 100 + i * 20]} stroke="blue" strokeWidth={1} />
    );
  }

  return <>{lines}</>;
};

export default GannTool;
