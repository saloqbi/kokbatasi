import React, { useContext, useEffect, useState } from "react";
import { Line, Text } from "react-konva";
import { SignalContext } from "../context/SignalContext";

const FibonacciTool = () => {
  const { selectedSignal } = useContext(SignalContext);
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (!selectedSignal?.data) return;

    const data = selectedSignal.data;
    const low = Math.min(...data.map(d => d.low));
    const high = Math.max(...data.map(d => d.high));

    const fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
    const y = fibLevels.map(lvl => 300 - (low + (high - low) * lvl));

    const generated = y.map((yVal, i) => ({
      y: yVal,
      label: `${Math.round(fibLevels[i] * 100)}%`
    }));

    setLines(generated);
  }, [selectedSignal]);

  return (
    <>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          <Line points={[50, line.y, 300, line.y]} stroke="gold" strokeWidth={1} />
          <Text x={305} y={line.y - 6} text={line.label} fontSize={10} fill="gold" />
        </React.Fragment>
      ))}
    </>
  );
};

export default FibonacciTool;
