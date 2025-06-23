import React, { useRef } from "react";

const DrawingTools = ({
  activeTool,
  lines = [],
  zones = [],
  fractals = [],
  waves = [],
  abcdPatterns = [],
  harmonicPatterns = [],
  priceActions = [],
  channels = [],
}) => {
  const svgRef = useRef();
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
      {activeTool === "line" &&
        lines.map((line, i) => (
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

      {activeTool === "zone" &&
        zones.map((zone, i) => {
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

      {activeTool === "fractal" &&
        fractals.map((p, idx) => (
          <text
            key={idx}
            x={indexToX(p.index)}
            y={p.type === "top" ? priceToY(p.price) - 10 : priceToY(p.price) + 15}
            fontSize="18"
            fill={p.type === "top" ? "red" : "blue"}
            textAnchor="middle"
          >
            {p.type === "top" ? "⬆️" : "⬇️"}
          </text>
        ))}

      {activeTool === "elliott" &&
        waves.map((wave, i) => {
          if (i === waves.length - 1) return null;
          const p1 = wave;
          const p2 = waves[i + 1];
          return (
            <g key={i}>
              <line
                x1={indexToX(p1.index)}
                y1={priceToY(p1.price)}
                x2={indexToX(p2.index)}
                y2={priceToY(p2.price)}
                stroke="green"
                strokeWidth="2"
              />
              <text
                x={indexToX(p1.index)}
                y={priceToY(p1.price) - 8}
                fontSize="12"
                fill="black"
                textAnchor="middle"
              >
                {p1.label}
              </text>
            </g>
          );
        })}

      {activeTool === "abcd" &&
        abcdPatterns.map((p, i) => {
          const pts = [p.points?.A, p.points?.B, p.points?.C, p.points?.D];
          if (pts.some(pt => !pt)) return null;
          return (
            <g key={i}>
              {pts.slice(0, -1).map((pt, idx) => {
                const p1 = pt;
                const p2 = pts[idx + 1];
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
              {pts.map((pt, idx) => (
                <text key={idx} x={indexToX(pt.index)} y={priceToY(pt.price) - 6} fontSize="10" fill="black">
                  {["A", "B", "C", "D"][idx]}
                </text>
              ))}
            </g>
          );
        })}

      {activeTool === "harmonic" &&
        harmonicPatterns.map((p, i) => {
          const pts = [p.points?.X, p.points?.A, p.points?.B, p.points?.C, p.points?.D];
          if (pts.some(pt => !pt)) return null;
          return (
            <g key={i}>
              {pts.slice(0, -1).map((pt, idx) => {
                const p1 = pt;
                const p2 = pts[idx + 1];
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
              {pts.map((pt, idx) => (
                <text key={idx} x={indexToX(pt.index)} y={priceToY(pt.price) - 6} fontSize="10" fill="black">
                  {["X", "A", "B", "C", "D"][idx]}
                </text>
              ))}
            </g>
          );
        })}

      {activeTool === "price" &&
        priceActions.map((pattern, i) => (
          <text key={i} x={indexToX(pattern.index)} y={20} fontSize="10" fill="black" textAnchor="middle">
            ⭐ {pattern.type} ({pattern.direction})
          </text>
        ))}

      {activeTool === "channel" &&
        channels.map((channel, index) => {
          const { from, to, offset } = channel;
          const x1 = indexToX(from.index);
          const y1 = priceToY(from.price);
          const x2 = indexToX(to.index);
          const y2 = priceToY(to.price);

          return (
            <g key={index}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="blue" strokeWidth={2} />
              <line
                x1={x1}
                y1={y1 + offset}
                x2={x2}
                y2={y2 + offset}
                stroke="blue"
                strokeWidth={2}
                strokeDasharray="5,5"
              />
            </g>
          );
        })}
    </svg>
  );
};

export default DrawingTools;
