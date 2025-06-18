import React, { useRef, useEffect } from "react";

const DrawingTools = ({
  activeTool,
  lines = [],
  zones = [],
  fractals = [],
  waves = [],
  abcdPatterns = [],
  harmonicPatterns = [],
  priceActions = [],
}) => {
  const svgRef = useRef();
  const width = 800;
  const height = 400;
  const padding = 40;

  // ✅ Debug Log
  useEffect(() => {
    console.log("🧪 activeTool:", activeTool);
    console.log("📏 lines:", lines);
    console.log("📦 zones:", zones);
    console.log("🌀 fractals:", fractals);
    console.log("🌊 elliott waves:", waves);
    console.log("🔷 abcdPatterns:", abcdPatterns);
    console.log("🦋 harmonicPatterns:", harmonicPatterns);
    console.log("⭐ priceActions:", priceActions);
  }, [activeTool, lines, zones, fractals, waves, abcdPatterns, harmonicPatterns, priceActions]);

  const allPrices = [
    ...fractals.map(p => p.price),
    ...waves.map(w => w.price),
    ...abcdPatterns.flatMap(p => [p.points?.A?.price, p.points?.B?.price, p.points?.C?.price, p.points?.D?.price]),
    ...harmonicPatterns.flatMap(p => [p.points?.X?.price, p.points?.A?.price, p.points?.B?.price, p.points?.C?.price, p.points?.D?.price]),
    ...zones.map(z => z.to),
    ...zones.map(z => z.from),
    ...lines.map(l => l.price),
  ].filter(p => typeof p === "number");

  const minPrice = Math.min(...allPrices, 90);
  const maxPrice = Math.max(...allPrices, 120);

  const priceToY = (price) => {
    const scale = (price - minPrice) / (maxPrice - minPrice);
    return height - padding - scale * (height - 2 * padding);
  };

  const indexToX = (index) => index * 80 + padding;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mt-6 border rounded bg-gray-50 cursor-crosshair"
    >
      {/* هنا يمكنك إبقاء كود الرسم حسب activeTool، أو تركه فارغاً فقط لاختبار البيانات */}
    </svg>
  );
};

export default DrawingTools;
