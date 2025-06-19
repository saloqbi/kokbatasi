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

const AllDrawingTools = ({ signalId, savedLines = [], onSaveLines = () => {} }) => {
  const { activeTool } = useContext(ToolContext);
  const [tempPoints, setTempPoints] = useState([]);
  const [lines, setLines] = useState(savedLines);

  const padding = 40;
  const canvasHeight = 400;
  const priceScale = 3;
  const indexScale = 10;

  useEffect(() => {
    setLines(savedLines);
  }, [savedLines]);

  const handleClick = (e) => {
    if (activeTool !== "line") return;

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const newPoint = { x: pointer.x, y: pointer.y };
    const updated = [...tempPoints, newPoint];
    setTempPoints(updated);

    if (updated.length === 2) {
      const newLine = {
        start: {
          x: updated[0].x,
          y: updated[0].y,
          index: Math.round((updated[0].x - padding) / indexScale),
          price: (canvasHeight - updated[0].y) / priceScale,
        },
        end: {
          x: updated[1].x,
          y: updated[1].y,
          index: Math.round((updated[1].x - padding) / indexScale),
          price: (canvasHeight - updated[1].y) / priceScale,
        },
      };
      const newLines = [...lines, newLine];
      setLines(newLines);
      setTempPoints([]);

      try {
        fetch(`/api/signals/${signalId}/tools/lines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: newLines }),
        }).then((res) => {
          if (res.ok) {
            console.log("✅ تم حفظ الخط في MongoDB");
            onSaveLines(newLines);
          }
        });
      } catch (err) {
        console.error("❌ فشل الحفظ:", err);
      }
    }
  };

  return (
    <Layer onClick={handleClick}>
      {activeTool === "line" &&
        lines.map((line, index) => {
          const x1 = line.start?.index != null ? line.start.index * indexScale + padding : line.start.x;
          const y1 = line.start?.price != null ? canvasHeight - line.start.price * priceScale : line.start.y;
          const x2 = line.end?.index != null ? line.end.index * indexScale + padding : line.end.x;
          const y2 = line.end?.price != null ? canvasHeight - line.end.price * priceScale : line.end.y;
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
