import React, { useRef, useState } from "react";

const DrawingTools = ({
  lines,
  zones,
  fractals = [],
  waves = [],
  onLinesChange,
  onZonesChange,
  onFractalsChange,
  onWavesChange
}) => {
  const svgRef = useRef(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 400 });
  const [drag, setDrag] = useState(null);

  // ✅ Zoom بعجلة الفأرة
  const handleWheel = (e) => {
    e.preventDefault();
    const scale = e.deltaY > 0 ? 1.1 : 0.9;
    const newW = viewBox.w * scale;
    const newH = viewBox.h * scale;
    setViewBox({
      ...viewBox,
      w: newW,
      h: newH
    });
  };

  // ✅ Pan بالفأرة
  const handleMouseDown = (e) => {
    setDrag({ x: e.clientX, y: e.clientY, viewBoxX: viewBox.x, viewBoxY: viewBox.y });
  };

  const handleMouseMove = (e) => {
    if (!drag) return;
    const dx = (e.clientX - drag.x) * (viewBox.w / 800);
    const dy = (e.clientY - drag.y) * (viewBox.h / 400);
    setViewBox({
      ...viewBox,
      x: drag.viewBoxX - dx,
      y: drag.viewBoxY - dy
    });
  };

  const handleMouseUp = () => {
    setDrag(null);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">✍️ أدوات الرسم</h3>
      <p>🛠 دعم Zoom وPan عبر عجلة وسحب الفأرة</p>

      <div className="space-y-2 mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          onClick={() => {
            const newLine = { x1: 0, y1: 0, x2: 100, y2: 100 };
            onLinesChange([...lines, newLine]);
          }}
        >
          ➕ إضافة خط افتراضي
        </button>

        <button
          className="bg-green-500 text-white px-4 py-1 ml-2 rounded"
          onClick={() => {
            const newZone = { x: 0, y: 0, width: 100, height: 20 };
            onZonesChange([...zones, newZone]);
          }}
        >
          ➕ إضافة منطقة دعم
        </button>

        <button
          className="bg-purple-500 text-white px-4 py-1 ml-2 rounded"
          onClick={() => {
            const newFractal = { x: 50, y: 50, direction: "up" };
            onFractalsChange([...fractals, newFractal]);
          }}
        >
          ➕ إضافة فراكتل
        </button>

        <button
          className="bg-pink-500 text-white px-4 py-1 ml-2 rounded"
          onClick={() => {
            const newWave = { points: [0, 0, 50, 50, 100, 20], label: "1" };
            onWavesChange([...waves, newWave]);
          }}
        >
          ➕ إضافة موجة إليوت
        </button>
      </div>

      {/* ✅ SVG مع دعم Zoom وPan */}
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
        {/* Fractals */}
        {fractals.map((p, idx) => (
          <text
            key={idx}
            x={p.index * 10}
            y={p.type === "top" ? 40 : 380}
            fontSize="16"
            fill={p.type === "top" ? "red" : "blue"}
          >
            {p.type === "top" ? "⬆️" : "⬇️"}
          </text>
        ))}

        {/* Elliott Waves */}
        {waves.length >= 2 &&
          waves.map((wave, i) => {
            if (i === waves.length - 1) return null;
            const p1 = waves[i];
            const p2 = waves[i + 1];
            return (
              <g key={i}>
                <line
                  x1={p1.index * 10}
                  y1={400 - p1.price}
                  x2={p2.index * 10}
                  y2={400 - p2.price}
                  stroke="green"
                  strokeWidth="2"
                />
                <text x={p1.index * 10} y={400 - p1.price - 10} fontSize="12" fill="black">
                  {p1.label}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
};

export default DrawingTools;
//