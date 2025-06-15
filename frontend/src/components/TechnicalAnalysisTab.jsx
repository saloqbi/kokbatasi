
import React from "react";

const TechnicalAnalysisTab = ({ lines, zones }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">📊 التحليل الفني</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>✅ عدد الخطوط: {lines.length}</li>
        <li>✅ عدد مناطق الدعم/المقاومة: {zones.length}</li>
        <li>📍 نمط رأس وكتفين</li>
        <li>📍 نمط قاع مزدوج</li>
        <li>📍 مناطق تداول ضيقة</li>
      </ul>
    </div>
  );
};

export default TechnicalAnalysisTab;
