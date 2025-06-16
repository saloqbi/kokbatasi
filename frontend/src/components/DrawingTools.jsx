import React, { useRef } from "react";

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
  const width = 800;
  const height = 400;
  const padding = 40;

  // اجمع جميع الأسعار لتحديد المقياس
  const allPrices = [
    ...fractals.map((p) => p.price),
    ...waves.map((w) => w.price),
  ];
  const minPrice = Math.min(...allPrices, 90);
  const maxPrice = Math.max(...allPrices, 120);

  // دالة تحويل السعر إلى إحداثي Y
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
      className="mt-6 border rounded bg-gray-50 cursor-grab"
    >
      {/* الخطوط */}
      {lines.map((line, idx) => {
        if ([line.x1, line.y1, line.x2, line.y2].some((v) => isNaN(v)))
          return null;
        return (
          <line
            key={idx}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="blue"
            strokeWidth="2"
          />
        );
      })}

      {/* مناطق الدعم والمقاومة */}
      {zones.map((zone, idx) => {
        if ([zone.x, zone.y, zone.width, zone.height].some((v) => isNaN(v)))
          return null;
        return (
          <rect
            key={idx}
            x={zone.x}
            y={zone.y}
            width={zone.width}
            height={zone.height}
            fill="orange"
            opacity="0.2"
          />
        );
      })}

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
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="green"
                strokeWidth="2"
              />
              <text
                x={x1}
                y={y1 - 8}
                fontSize="12"
                fill="black"
                textAnchor="middle"
              >
                {p1.label}
              </text>
            </g>
          );
        })}
    </svg>
  );
};

export default DrawingTools;
