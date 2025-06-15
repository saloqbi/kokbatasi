
import React from "react";

const DrawingTools = ({ lines, zones, onLinesChange, onZonesChange }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">✍️ أدوات الرسم</h3>
      <p>🛠 هذه الواجهة مخصصة للرسم اليدوي والتحليل التفاعلي (سيتم تطوير أدوات السحب قريبًا)</p>
      <button
        className="bg-blue-500 text-white px-4 py-1 mt-2 rounded"
        onClick={() => {
          const newLine = { x1: 0, y1: 0, x2: 100, y2: 100 };
          onLinesChange([...lines, newLine]);
        }}
      >
        ➕ إضافة خط افتراضي
      </button>
      <button
        className="bg-green-500 text-white px-4 py-1 mt-2 ml-2 rounded"
        onClick={() => {
          const newZone = { x: 0, y: 0, width: 100, height: 20 };
          onZonesChange([...zones, newZone]);
        }}
      >
        ➕ إضافة منطقة دعم
      </button>
    </div>
  );
};

export default DrawingTools;
