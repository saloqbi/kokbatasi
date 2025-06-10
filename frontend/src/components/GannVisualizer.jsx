
import { useState } from 'react';
import { Stage, Layer, Line, Rect, Text } from 'react-konva';

export default function GannVisualizer() {
  const [tools, setTools] = useState({
    gannAngles: false,
    squareOfNine: false,
    harmonic: false,
    rsi: false,
    support: false,
    demand: false,
  });

  const toggleTool = (key) => {
    setTools((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 space-y-2 bg-gray-100">
        <h2 className="text-xl font-bold">🧰 أدوات التحليل</h2>
        {Object.keys(tools).map((key) => (
          <div key={key}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={tools[key]}
                onChange={() => toggleTool(key)}
              />
              <span>{key}</span>
            </label>
          </div>
        ))}
      </div>

      <div className="w-3/4">
        <Stage width={900} height={600} className="border">
          <Layer>
            {tools.gannAngles && (
              <>
                <Line points={[100, 500, 200, 400]} stroke="blue" strokeWidth={2} />
                <Line points={[100, 500, 250, 350]} stroke="blue" strokeWidth={2} />
              </>
            )}

            {tools.squareOfNine && (
              <Rect x={300} y={100} width={200} height={200} stroke="purple" strokeWidth={2} />
            )}

            {tools.harmonic && (
              <Line
                points={[500, 500, 540, 440, 580, 460, 620, 400]}
                stroke="orange"
                strokeWidth={2}
              />
            )}

            {tools.rsi && (
              <Line points={[100, 100, 300, 120]} stroke="green" strokeWidth={2} dash={[4, 4]} />
            )}

            {tools.support && (
              <Line points={[50, 550, 850, 550]} stroke="red" strokeWidth={1} dash={[2, 2]} />
            )}

            {tools.demand && (
              <Rect x={600} y={300} width={100} height={50} fill="#fde68a" opacity={0.5} />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
