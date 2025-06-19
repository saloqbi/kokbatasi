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
  console.log("🛠️ activeTool =", activeTool);
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
      const newLine = { start: updated[0], end: updated[1] };
      const newLines = [...lines, newLine];
      setLines(newLines);
      setTempPoints([]);

      // الحفظ إلى قاعدة البيانات
      try {
        fetch(`/api/signals/${signalId}/tools/lines`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lines: newLines }),
        }).then(res => res.json()).then((res) => {
          if (res.success || res.ok) {
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
    <Layer onDblClick={handleClick}>
      {/* أدوات التحليل الأخرى */}
      {activeTool === "line" &&
        lines.map((line, i) => (
          <Line
            key={i}
            points={[line.start.x, line.start.y, line.end.x, line.end.y]}
            stroke="blue"
            strokeWidth={2}
          />
        ))}
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