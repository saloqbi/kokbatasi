
import React, { useContext, useEffect, useState } from 'react';
import { Line, Text } from 'react-konva';
import { SignalContext } from '../context/SignalContext';

const ElliottWaveTool = () => {
  const { selectedSignal } = useContext(SignalContext);
  const [waves, setWaves] = useState([]);

  useEffect(() => {
    if (!selectedSignal || !selectedSignal.data) return;

    const wavePoints = selectedSignal.data.slice(0, 5).map((p, i) => ({
      x: i * 80 + 100,
      y: 300 - p.price,
      label: ['1', '2', '3', '4', '5'][i]
    }));

    setWaves(wavePoints);
  }, [selectedSignal]);

  return (
    <>
      {waves.map((p, i) => (
        i > 0 && (
          <>
            <Line
              key={`wave-${i}`}
              points={[waves[i-1].x, waves[i-1].y, p.x, p.y]}
              stroke="purple"
              strokeWidth={2}
            />
            <Text
              x={(p.x + waves[i-1].x) / 2}
              y={(p.y + waves[i-1].y) / 2 - 12}
              text={p.label}
              fill="purple"
              fontSize={12}
            />
          </>
        )
      ))}
    </>
  );
};

export default ElliottWaveTool;
