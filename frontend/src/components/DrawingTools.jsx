import React, { useRef, useContext } from "react";
import { ToolContext } from "../context/ToolContext";

const DrawingTools = ({
  lines,
  zones,
  fractals,
  waves,
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

  const allPrices = [...fractals.map((p) => p.price), ...waves.map((w) => w.price)];
  const minPrice = Math.min(...allPrices, 90);
  const maxPrice = Math.max(...allPrices, 120);

  const priceToY = (price) => {
    const scale = (price - minPrice) / (maxPrice - minPrice);
    return height - padding - scale * (height - 2 * padding);
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mt-6 border rounded bg-gray-50 cursor-crosshair"
    >
      {lines.map((line, idx) => (
        <line
          key={idx}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="blue"
          strokeWidth="2"
        />
      ))}

      {zones.map((zone, idx) => (
        <rect
          key={idx}
          x={zone.x}
          y={zone.y}
          width={zone.width}
          height={zone.height}
          fill="orange"
          opacity="0.2"
        />
      ))}

      {fractals.map((p, idx) => {
        const x = p.index * 80 + padding;
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

      {waves.length >= 2 &&
        waves.map((wave, i) => {
          if (i === waves.length - 1) return null;
          const p1 = waves[i];
          const p2 = waves[i + 1];

          const x1 = p1.index * 80 + padding;
          const y1 = priceToY(p1.price);
          const x2 = p2.index * 80 + padding;
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

      {activeTool === "gann-box" && (
        <rect x={150} y={100} width={200} height={150} fill="purple" opacity="0.1" stroke="purple" />
      )}

      {activeTool === "gann-grid" && (
        Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <line x1={100 + i * 40} y1={0} x2={100 + i * 40} y2={400} stroke="gray" strokeDasharray="4 2" />
            <line x1={0} y1={50 + i * 40} x2={800} y2={50 + i * 40} stroke="gray" strokeDasharray="4 2" />
          </g>
        ))
      )}

      {activeTool === "gann-fan" && (
        <g>
          {[1, 2, 3].map((ratio, i) => (
            <line
              key={i}
              x1={100}
              y1={300}
              x2={100 + 100}
              y2={300 - 100 / ratio}
              stroke="brown"
              strokeWidth="1.5"
            />
          ))}
        </g>
      )}
    </svg>
  );
};

export default DrawingTools;
