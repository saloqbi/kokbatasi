import React from "react";

const DrawingTools = ({ lines, zones, fractals = [], waves = [], onLinesChange, onZonesChange, onFractalsChange, onWavesChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">✍️ أدوات الرسم</h3>
      <p>🛠 هذه الواجهة مخصصة للرسم اليدوي والتحليل التفاعلي (يشمل خطوط، مناطق، فراكتل، وموجات إليوت)</p>

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
    </div>
  );
};

export default DrawingTools;
