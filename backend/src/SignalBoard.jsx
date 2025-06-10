import React from "react";

const signals = [
  { id: 1, type: "Buy", symbol: "BTCUSD", rating: 4.5, source: "AI", time: "قبل 5 دقائق" },
  { id: 2, type: "Sell", symbol: "ETHUSD", rating: 3.8, source: "Manual", time: "قبل 12 دقيقة" },
  { id: 3, type: "Buy", symbol: "AAPL", rating: 5.0, source: "AI", time: "قبل 30 دقيقة" },
];

const SignalBoard = () => {
  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        ✨ مرحبًا بك في كوكبة تاسي ✨
      </h1>
      <p className="text-center text-gray-300 mb-8">منصة التوصيات الذكية والتحليل المتقدم</p>

      <h2 className="text-2xl font-bold mb-4">📈 الإشارات النشطة</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="p-4 rounded-xl shadow bg-gray-800 border border-gray-700"
          >
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">{signal.time}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${signal.type === "Buy" ? "bg-green-600" : "bg-red-600"}`}>{signal.type}</span>
            </div>
            <h3 className="text-lg font-semibold">{signal.symbol}</h3>
            <p className="text-sm mt-1">المصدر: {signal.source}</p>
            <div className="mt-2">
              <span className="text-yellow-400">⭐ {signal.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignalBoard;