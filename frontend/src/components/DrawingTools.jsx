import React, { useRef, useContext } from "react";
import { ToolContext } from "../context/ToolContext";

const DrawingTools = ({
  lines = [],
  zones = [],
  fractals = [],
  waves = [],
  abcdPatterns = [],
  harmonicPatterns = [],
  priceActions = [],
  onLinesChange,
  onZonesChange,
  onFractalsChange,
  onWavesChange,
}) => {
  const svgRef = useRef();
  const { activeTool } = useContext(ToolContext);
  const width = 800;
  const height = 400;
  const padding = 40;

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
    if (typeof price !== "number" || isNaN(price)) return 0;
    const scale = (price - minPrice) / (maxPrice - minPrice);
    return height - padding - scale * (height - 2 * padding);
  };

  const indexToX = (index) => typeof index === "number" ? index * 80 + padding : 0;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mt-6 border rounded bg-gray-50 cursor-crosshair"
    >
      {/* ⭐️ Price Action */}
      {activeTool === "price-action" && priceActions.map((pattern, i) => {
        const x = indexToX(pattern.index);
        return (
          <text key={`pa-${i}`} x={x} y={20} fontSize="10" fill="black" textAnchor="middle">
            ⭐ {pattern.type} ({pattern.direction})
          </text>
        );
      })}

      {/* 📏 خط أفقي */}
      {activeTool === "line" && lines.map((line, i) => (
        <line
          key={`line-${i}`}
          x1={0}
          y1={priceToY(line.price)}
          x2={width}
          y2={priceToY(line.price)}
          stroke="gray"
          strokeWidth="1"
          strokeDasharray="4"
        />
      ))}

      {/* 📦 مناطق دعم/مقاومة */}
      {activeTool === "zone" && zones.map((zone, i) => {
        const y1 = priceToY(zone.from);
        const y2 = priceToY(zone.to);
        return (
          <rect
            key={`zone-${i}`}
            x={0}
            y={Math.min(y1, y2)}
            width={width}
            height={Math.abs(y1 - y2)}
            fill="orange"
            opacity={0.1}
          />
        );
      })}

      {/* 🌀 فراكتلات */}
      {activeTool === "fractal" && fractals.map((p, idx) => {
        const x = indexToX(p.index);
        const y = priceToY(p.price);
        return (
          <text
            key={idx}
            x={x}
            y={p.type === "top" ? y - 10 : y + 15}
            fontSize="18"
            fill={p.type === "top" ? "red" : "blue"}
            textAnchor="middle"
          >
            {p.type === "top" ? "⬆️" : "⬇️"}
          </text>
        );
      })}

      {/* 🌊 إليوت */}
      {activeTool === "elliott" && waves.length >= 2 &&
        waves.map((wave, i) => {
          if (i === waves.length - 1) return null;
          const p1 = waves[i];
          const p2 = waves[i + 1];
          const x1 = indexToX(p1.index);
          const y1 = priceToY(p1.price);
          const x2 = indexToX(p2.index);
          const y2 = priceToY(p2.price);
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="green" strokeWidth="2" />
              <text x={x1} y={y1 - 8} fontSize="12" fill="black" textAnchor="middle">
                {p1.label}
              </text>
            </g>
          );
        })}

      {/* 🔷 ABCD Pattern */}
      {activeTool === "abcd" && abcdPatterns.map((p, i) => {
        const A = p.points?.A, B = p.points?.B, C = p.points?.C, D = p.points?.D;
        if (!A || !B || !C || !D) return null;
        const points = [A, B, C, D];
        return (
          <g key={i}>
            {points.slice(0, -1).map((pt, idx) => {
              const p1 = pt;
              const p2 = points[idx + 1];
              return (
                <line
                  key={idx}
                  x1={indexToX(p1.index)}
                  y1={priceToY(p1.price)}
                  x2={indexToX(p2.index)}
                  y2={priceToY(p2.price)}
                  stroke="purple"
                  strokeWidth="2"
                />
              );
            })}
            {points.map((pt, idx) => (
              <text key={`lbl-${idx}`} x={indexToX(pt.index)} y={priceToY(pt.price) - 6} fontSize="10" fill="black">
                {["A", "B", "C", "D"][idx]}
              </text>
            ))}
          </g>
        );
      })}

      {/* 🦋 Harmonic Pattern */}
      {activeTool === "harmonic" && harmonicPatterns.map((p, i) => {
        const X = p.points?.X, A = p.points?.A, B = p.points?.B, C = p.points?.C, D = p.points?.D;
        if (!X || !A || !B || !C || !D) return null;
        const points = [X, A, B, C, D];
        return (
          <g key={i}>
            {points.slice(0, -1).map((pt, idx) => {
              const p1 = pt;
              const p2 = points[idx + 1];
              return (
                <line
                  key={idx}
                  x1={indexToX(p1.index)}
                  y1={priceToY(p1.price)}
                  x2={indexToX(p2.index)}
                  y2={priceToY(p2.price)}
                  stroke="teal"
                  strokeWidth="2"
                  strokeDasharray="4"
                />
              );
            })}
            {points.map((pt, idx) => (
              <text key={`lbl-${idx}`} x={indexToX(pt.index)} y={priceToY(pt.price) - 6} fontSize="10" fill="black">
                {["X", "A", "B", "C", "D"][idx]}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export default DrawingTools;
