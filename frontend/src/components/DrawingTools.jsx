// ✅ مكون مرجعي جاهز للتجربة المباشرة
import React, { useContext } from "react";
import { ToolContext } from "../context/ToolContext";

const DrawingTools = ({
  lines = [],
  zones = [],
  fractals = [],
  waves = [],
  abcdPatterns = [],
  harmonicPatterns = [],
  priceActions = [],
}) => {
  const { activeTool } = useContext(ToolContext);
  console.log("🎯 activeTool =", activeTool);

  return (
    <div className="mt-4 p-4 border rounded bg-gray-50 text-sm">
      <p className="mb-2 font-semibold">🧪 Debug DrawingTools</p>

      <div className="text-blue-700">الحالة الحالية للأداة: <strong>{activeTool}</strong></div>

      {activeTool === "line" && <div>🟢 أداة الخط مفعّلة. سيتم عرض خطوط هنا.</div>}
      {activeTool === "zone" && <div>🟠 أداة المنطقة مفعّلة. سيتم عرض مناطق الدعم/المقاومة هنا.</div>}
      {activeTool === "fractal" && <div>🔵 عرض نقاط الفراكتل: {fractals.length}</div>}
      {activeTool === "elliott" && <div>🟣 عرض موجات إليوت: {waves.length}</div>}
      {activeTool === "abcd" && <div>🔷 أنماط ABCD: {abcdPatterns.length}</div>}
      {activeTool === "harmonic" && <div>🌀 أنماط هارمونيك: {harmonicPatterns.length}</div>}
      {activeTool === "price" && <div>⭐ أنماط برايس أكشن: {priceActions.length}</div>}
    </div>
  );
};

export default DrawingTools;
