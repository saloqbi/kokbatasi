import React, { useContext } from "react";
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

const AllDrawingTools = () => {
  const { activeTool } = useContext(ToolContext);

  return (
    <>
      {activeTool === "line" && <TrendlineTool />}
      {activeTool === "zone" && <SupportResistanceTool />}
      {activeTool?.startsWith("fib") && <FibonacciTool />}
      {activeTool?.startsWith("gann") && <GannTool />}
      {activeTool === "fractal" && <FractalTool />}
      {activeTool === "elliott" && <ElliottWaveTool />}
      {activeTool === "ict" && <ICTTool />}
      {activeTool === "channel" && <ChannelTool />}
      {activeTool === "wyckoff" && <WyckoffTool />}
    </>
  );
};

export default AllDrawingTools;
