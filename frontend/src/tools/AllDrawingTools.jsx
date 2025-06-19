import React, { useContext, useEffect, useState } from "react";
import { Layer, Line } from "react-konva";
import { ToolContext } from "../context/ToolContext";
import TrendlineTool from "./TrendlineTool";
import SupportResistanceTool from "./SupportResistanceTool";
import FibonacciTool from "./FibonacciTool";
import GannTool from "./GannTool";
import FractalTool from "./FractalTool";
import ElliottWaveTool from "./ElliottWaveTool";
import ICTTool from "./ICTTool";
import ChannelTool from "./ChannelTool";
import WyckoffTool from "./WyckoffTool";

const AllDrawingTools = ({ signalId, savedLines = [] }) => {
  const { activeTool } = useContext(ToolContext);

  const padding = 40;
  const canvasHeight = 400;
  const priceScale = 3;
  const indexScale = 10;

  return (
    <Layer>
      {activeTool === "line" &&
        savedLines.map((line, index) => {
          const x1 = line.start?.index * indexScale + padding;
          const y1 = canvasHeight - line.start?.price * priceScale;
          const x2 = line.end?.index * indexScale + padding;
          const y2 = canvasHeight - line.end?.price * priceScale;
          return (
            <Line
              key={index}
              points={[x1, y1, x2, y2]}
              stroke="blue"
              strokeWidth={2}
            />
          );
        })}

      {activeTool === "zone" && <SupportResistanceTool />}
      {activeTool?.startsWith("fib") && <FibonacciTool />}
      {activeTool?.startsWith("gann") && <GannTool />}
      {activeTool === "fractal" && <FractalTool />}
      {activeTool === "elliott" && <ElliottWaveTool />}
      {activeTool === "ict" && <ICTTool />}
      {activeTool === "channel" && <ChannelTool />}
      {activeTool === "wyckoff" && <WyckoffTool />}
    </Layer>
  );
};

export default AllDrawingTools;
