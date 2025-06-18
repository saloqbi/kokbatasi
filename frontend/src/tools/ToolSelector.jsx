import React, { useContext } from 'react';
import { ToolContext } from '../context/ToolContext';

const ToolSelector = () => {
  const { activeTool, setActiveTool } = useContext(ToolContext);

  const tools = [
    { key: 'line', label: '📏 خط الاتجاه' },
    { key: 'zone', label: '📦 منطقة دعم/مقاومة' },
    { key: 'gann-box', label: '🟪 Gann Box' },
    { key: 'gann-grid', label: '🟫 Gann Grid' },
    { key: 'gann-fan', label: '🟤 Gann Fan' },
    { key: 'gann-circle', label: '⚪ Gann Circle' },
    { key: 'gann-square', label: '🟩 Gann Square' },
    { key: 'fib-retracement', label: '🟡 Fibonacci Retracement' },
    { key: 'fib-fan', label: '🟢 Fibonacci Fan' },
    { key: 'fib-zones', label: '🔵 Fibonacci Time Zones' },
    { key: 'fractal', label: '🌀 Fractal Tool' },
    { key: 'elliott', label: '🌊 Elliott Waves' },
    { key: 'abcd', label: '🔷 ABCD Pattern' },
    { key: 'harmonic', label: '🎯 Harmonic Pattern' },
    { key: 'price-action', label: '⭐ Price Action' },
    { key: 'ict', label: '🔍 ICT Tool' },
    { key: 'channel', label: '📊 Channel Tool' },
    { key: 'wyckoff', label: '📚 Wyckoff Tool' },
  ];

  return (
    <div className="p-4 border rounded mt-4 bg-white shadow">
      <h3 className="text-lg font-semibold mb-3 text-center">🧰 أدوات التحليل الفني:</h3>
      <div className="flex flex-wrap gap-2 items-center justify-center">
        {tools.map((tool) => (
          <button
            key={tool.key}
            onClick={() => setActiveTool(tool.key)}
            className={`px-3 py-1 rounded border text-sm transition duration-200 ${
              activeTool === tool.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-blue-100'
            }`}
          >
            {tool.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ToolSelector;
