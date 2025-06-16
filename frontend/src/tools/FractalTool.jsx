
import React, { useContext, useEffect, useState } from 'react';
import { Layer, Circle } from 'react-konva';
import { useSignalContext } from '../context/SignalContext';

const FractalTool = () => {
  const { selectedSignal } = useSignalContext();
  const [peaks, setPeaks] = useState([]);
  const [troughs, setTroughs] = useState([]);

  useEffect(() => {
    if (!selectedSignal || !selectedSignal.data) return;

    const peaksTemp = [], troughsTemp = [];
    const data = selectedSignal.data;

    for (let i = 2; i < data.length - 2; i++) {
      const p = data[i];
      if (data[i - 2].high < p.high && data[i - 1].high < p.high &&
          data[i + 1].high < p.high && data[i + 2].high < p.high)
        peaksTemp.push({ x: i * 10, y: 300 - p.high });

      if (data[i - 2].low > p.low && data[i - 1].low > p.low &&
          data[i + 1].low > p.low && data[i + 2].low > p.low)
        troughsTemp.push({ x: i * 10, y: 300 - p.low });
    }

    setPeaks(peaksTemp);
    setTroughs(troughsTemp);
  }, [selectedSignal]);

  return (
    <Layer>
      {peaks.map((p, i) => <Circle key={`p${i}`} x={p.x} y={p.y} radius={4} fill="red" />)}
      {troughs.map((t, i) => <Circle key={`t${i}`} x={t.x} y={t.y} radius={4} fill="blue" />)}
    </Layer>
  );
};

export default FractalTool;
