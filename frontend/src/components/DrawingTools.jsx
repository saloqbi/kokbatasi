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

  const allPrices = [...fractals.map(p => p.price), ...waves.map(w => w.price)];
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
      {/* Trendline */}
      {activeTool === "trendline" && (
        <line x1={100} y1={100} x2={300} y2={200} stroke="blue" strokeWidth="2" />
      )}

      {/* Support/Resistance Zones */}
      {activeTool === "zone" && zones.map((zone, idx) => (
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

      {/* Fractals */}
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

      {/* Elliott Waves */}
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

      {/* Gann Tools */}
      {activeTool === "gann-box" && (
        <rect x={150} y={100} width={200} height={150} fill="purple" opacity="0.1" stroke="purple" />
      )}

      {activeTool === "gann-grid" &&
        Array.from({ length: 5 }).map((_, i) => (
          <g key={i}>
            <line x1={100 + i * 40} y1={0} x2={100 + i * 40} y2={400} stroke="gray" strokeDasharray="4 2" />
            <line x1={0} y1={50 + i * 40} x2={800} y2={50 + i * 40} stroke="gray" strokeDasharray="4 2" />
          </g>
        ))}

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

      {activeTool === "gann-circle" && (
        <g>
          {[40, 80, 120, 160].map((r, i) => (
            <circle key={i} cx={400} cy={200} r={r} stroke="purple" strokeWidth="1.5" fill="none" strokeDasharray="4 2" />
          ))}
        </g>
      )}

      {activeTool === "gann-square" && (
        <g transform="rotate(45 400 200)">
          {[40, 80, 120, 160].map((size, i) => (
            <rect
              key={i}
              x={400 - size / 2}
              y={200 - size / 2}
              width={size}
              height={size}
              fill="none"
              stroke="green"
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      {/* Fibonacci Retracement */}
      {activeTool === "fib-retracement" && (
        <line x1={100} y1={100} x2={300} y2={200} stroke="gold" strokeWidth="2" />
      )}

      {/* Fibonacci Fan */}
      {activeTool === "fib-fan" && (
        <g>
          {[1, 2, 3].map((ratio, i) => (
            <line
              key={i}
              x1={150}
              y1={300}
              x2={150 + 120}
              y2={300 - 120 / ratio}
              stroke="green"
              strokeWidth="1.5"
            />
          ))}
        </g>
      )}

      {/* Fibonacci Time Zones */}
      {activeTool === "fib-zones" && (
        <g>
          {[0, 1, 2, 3, 5, 8, 13].map((step, i) => (
            <line
              key={i}
              x1={100 + step * 20}
              y1={0}
              x2={100 + step * 20}
              y2={height}
              stroke="blue"
              strokeDasharray="4 2"
              strokeWidth="1"
            />
          ))}
        </g>
      )}

      {/* ICT Tool */}
      {activeTool === "ict" && (
        <text x={200} y={250} fontSize="20">🔍 ICT Tool</text>
      )}

      {/* Channel Tool */}
      {activeTool === "channel" && (
        <g>
          <rect x={150} y={150} width={300} height={80} fill="none" stroke="teal" strokeDasharray="4 2" />
        </g>
      )}

      {/* Wyckoff Tool */}
      {activeTool === "wyckoff" && (
        <text x={300} y={280} fontSize="18">📚 Wyckoff Zone</text>
      )}
    </svg>
  );
};

export default DrawingTools;
