import React, { useRef, useContext } from "react";
import { ToolContext } from "../context/ToolContext";

const DrawingTools = ({
  lines = [{ price: 102 }],
  zones = [{ from: 100, to: 98 }],
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
    ...abcdPatterns.flatMap(p => [p.points.A.price, p.points.B.price, p.points.C.price, p.points.D.price]),
    ...harmonicPatterns.flatMap(p => [p.points.X.price, p.points.A.price, p.points.B.price, p.points.C.price, p.points.D.price]),
    ...zones.map(z => z.to),
    ...zones.map(z => z.from),
    ...lines.map(l => l.price),
  ];

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
      {/* ⭐️ Price Action Patterns */}
      {activeTool === "price-action" && priceActions.map((pattern, i) => {
        const x = indexToX(pattern.index);
        return (
          <text key={`pa-${i}`} x={x} y={20} fontSize="10" fill="black" textAnchor="middle">
            ⭐ {pattern.type} ({pattern.direction})
          </text>
        );
      })}

      {/* Support & Resistance Lines */}
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

      {/* Zones */}
      {activeTool === "zone" && zones.map((zone, i) => {
        const y1 = priceToY(zone.from);
        const y2 = priceToY(zone.to);
        return (
          <rect
            key={`zone-${i}`}
            x={0}
            y={y2}
            width={width}
            height={y1 - y2}
            fill="orange"
            opacity={0.1}
          />
        );
      })}

      {/* Fractals */}
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

      {/* Elliott Waves */}
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

      {/* ABCD Patterns */}
      {activeTool === "abcd" && abcdPatterns.map((pattern, i) => {
        const { A, B, C, D } = pattern.points;
        const xa = indexToX(A.index), ya = priceToY(A.price);
        const xb = indexToX(B.index), yb = priceToY(B.price);
        const xc = indexToX(C.index), yc = priceToY(C.price);
        const xd = indexToX(D.index), yd = priceToY(D.price);
        return (
          <g key={`abcd-${i}`}>
            <line x1={xa} y1={ya} x2={xb} y2={yb} stroke="green" strokeWidth="2" />
            <line x1={xb} y1={yb} x2={xc} y2={yc} stroke="orange" strokeWidth="2" />
            <line x1={xc} y1={yc} x2={xd} y2={yd} stroke="green" strokeWidth="2" />
            <text x={xd + 5} y={yd} fontSize="10" fill="gray">
              {pattern.direction.toUpperCase()} ABCD
            </text>
          </g>
        );
      })}

      {/* Harmonic Patterns */}
      {activeTool === "harmonic" && harmonicPatterns.map((pattern, i) => {
        const { X, A, B, C, D } = pattern.points;
        const xX = indexToX(X.index), yX = priceToY(X.price);
        const xA = indexToX(A.index), yA = priceToY(A.price);
        const xB = indexToX(B.index), yB = priceToY(B.price);
        const xC = indexToX(C.index), yC = priceToY(C.price);
        const xD = indexToX(D.index), yD = priceToY(D.price);
        return (
          <g key={`harmonic-${i}`}>
            <polyline
              points={`${xX},${yX} ${xA},${yA} ${xB},${yB} ${xC},${yC} ${xD},${yD}`}
              fill="none"
              stroke="purple"
              strokeWidth="2"
            />
            <text x={xD + 5} y={yD} fontSize="10" fill="purple">
              {pattern.name} ({pattern.direction})
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default DrawingTools;
//