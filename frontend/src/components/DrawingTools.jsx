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
  const viewBox = { x: 0, y: 0, w: 800, h: 400 };

  const handleWheel = (e) => {
    e.preventDefault();
    // يمكن لاحقًا تنفيذ Zoom
  };

  const handleMouseDown = () => {};
  const handleMouseMove = () => {};
  const handleMouseUp = () => {};

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="400"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="mt-6 border rounded bg-gray-50 cursor-grab"
    >
      {/* الخطوط */}
      {lines.map((line, idx) => {
        if (
          [line.x1, line.y1, line.x2, line.y2].some((v) => isNaN(v))
        )
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
        if (
          [zone.x, zone.y, zone.width, zone.height].some((v) => isNaN(v))
        )
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
        const x = p.index * 10;
        const y = p.type === "top" ? 40 : 380;
        if (isNaN(x) || isNaN(y)) return null;
        return (
          <text
            key={idx}
            x={x}
            y={y}
            fontSize="16"
            fill={p.type === "top" ? "red" : "blue"}
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

          const x1 = p1.index * 10;
          const y1 = 400 - p1.price;
          const x2 = p2.index * 10;
          const y2 = 400 - p2.price;

          if ([x1, y1, x2, y2].some((v) => isNaN(v))) return null;

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
              {!isNaN(p1.index) && !isNaN(p1.price) && (
                <text x={x1} y={y1 - 10} fontSize="12" fill="black">
                  {p1.label}
                </text>
              )}
            </g>
          );
        })}
    </svg>
  );
};

export default DrawingTools;
