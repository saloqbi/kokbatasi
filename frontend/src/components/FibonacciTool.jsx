
import React from "react";

const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

const FibonacciTool = () => {
  const start = 100;
  const end = 200;

  return (
    <div className="my-6 border p-4 rounded-xl bg-yellow-50">
      <h3 className="text-lg font-bold mb-2">🌀 مستويات فيبوناتشي</h3>
      <div className="relative w-full h-64 border bg-white rounded-md overflow-hidden">
        {levels.map((level, idx) => {
          const y = (1 - level) * 100;
          return (
            <div
              key={idx}
              className="absolute w-full border-t border-yellow-500 text-xs text-yellow-700"
              style={{ top: `${y}%` }}
            >
              <div className="pl-2">Level {level} - {Math.round(start + (end - start) * level)} ريال</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FibonacciTool;
