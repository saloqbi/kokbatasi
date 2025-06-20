import React, { useContext, useEffect, useState } from "react";
import { Layer, Line } from "react-konva";
import { ToolContext } from "../context/ToolContext";
import SupportResistanceTool from "./SupportResistanceTool";
import FibonacciTool from "./FibonacciTool";
import GannTool from "./GannTool";
import FractalTool from "./FractalTool";
import ElliottWaveTool from "./ElliottWaveTool";
import ICTTool from "./ICTTool";
import ChannelTool from "./ChannelTool";
import WyckoffTool from "./WyckoffTool";

const AllDrawingTools = ({
  signalId,
  savedLines = [],
  onSaveLines = () => {},
  xScale,
  yScale,
}) => {
  const { activeTool } = useContext(ToolContext);
  const [tempPoints, setTempPoints] = useState([]);
  const [lines, setLines] = useState(savedLines);

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
      const getIndexFromX = (x) => {
        if (!xScale) return 0;
        const domain = xScale.domain();
        const range = xScale.range();
        const relative = x / (range[1] - range[0]);
        return Math.round(relative * domain.length);
      };

      const newLine = {
        start: {
          x: updated[0].x,
          y: updated[0].y,
          index: getIndexFromX(updated[0].x),
          price: yScale ? yScale.invert(updated[0].y) : 0,
        },
        end: {
          x: updated[1].x,
          y: updated[1].y,
          index: getIndexFromX(updated[1].x),
          price: yScale ? yScale.invert(updated[1].y) : 0,
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
          const x1 = xScale ? xScale(line.start.index) : line.start.x;
          const y1 = yScale ? yScale(line.start.price) : line.start.y;
          const x2 = xScale ? xScale(line.end.index) : line.end.x;
          const y2 = yScale ? yScale(line.end.price) : line.end.y;
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
