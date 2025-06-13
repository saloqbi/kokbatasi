
import React from 'react';
import TrendlineTool from './TrendlineTool';
import FibonacciTool from './FibonacciTool';
import GannTool from './GannTool';
import FractalTool from './FractalTool';
import ElliottWaveTool from './ElliottWaveTool';
import ICTTool from './ICTTool';
import SupportResistanceTool from './SupportResistanceTool';
import ChannelTool from './ChannelTool';
import WyckoffTool from './WyckoffTool';

const ToolSelector = () => {
  return (
    <div className="p-4 border rounded mt-4">
      <h3 className="text-lg font-semibold mb-2">🧰 أدوات التحليل الفني:</h3>
      <TrendlineTool />
      <FibonacciTool />
      <GannTool />
      <FractalTool />
      <ElliottWaveTool />
      <ICTTool />
      <SupportResistanceTool />
      <ChannelTool />
      <WyckoffTool />
    </div>
  );
};

export default ToolSelector;
