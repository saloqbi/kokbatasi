
import React, { useState } from "react";
import RSIChart from "../components/RSIChart";
import FibonacciTool from "../components/FibonacciTool";
import GannTool from "../components/GannTool";

const ManualSignal = () => {
  const [input, setInput] = useState("");
  const [tools, setTools] = useState([]);

  const extractTools = (text) => {
    const lower = text.toLowerCase();
    const results = [];

    if (lower.includes("شراء") || lower.includes("buy")) results.push("📈 إشارة شراء");
    if (lower.includes("بيع") || lower.includes("sell")) results.push("📉 إشارة بيع");
    if (lower.includes("rsi")) results.push("📊 مؤشر RSI");
    if (lower.includes("macd")) results.push("📊 مؤشر MACD");
    if (lower.includes("فيبوناتشي") || lower.includes("fibonacci")) results.push("🌀 فيبوناتشي");
    if (lower.includes("جان") || lower.includes("gann")) results.push("📐 أدوات Gann");

    return results;
  };

  const handleSubmit = () => {
    const detected = extractTools(input);
    setTools(detected);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📥 إدخال توصية يدوية</h1>

      <textarea
        className="w-full p-3 border rounded-xl h-40 resize-none"
        placeholder="ألصق التوصية هنا..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>

      <button
        className="mt-4 px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        onClick={handleSubmit}
      >
        🔄 تحميل التوصية
      </button>

      {tools.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">🛠️ الأدوات المُفعّلة:</h2>
          <ul className="list-disc list-inside space-y-1">
            {tools.map((tool, index) => (
              <li key={index} className="text-lg">{tool}</li>
            ))}
          </ul>

          {/* عرض الأدوات الفنية تلقائيًا */}
          {tools.includes("📊 مؤشر RSI") && <RSIChart />}
          {tools.includes("🌀 فيبوناتشي") && <FibonacciTool />}
          {tools.includes("📐 أدوات Gann") && <GannTool />}
        </div>
      )}
    </div>
  );
};

export default ManualSignal;
