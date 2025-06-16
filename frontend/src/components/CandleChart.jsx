
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CandleChart = ({ data = [] }) => {
  const chartRef = useRef();

  // بيانات افتراضية في حال فشل جلب البيانات الحقيقية
  const fallbackData = [
    { time: "2025-06-15", open: 100, high: 110, low: 95, close: 105 },
    { time: "2025-06-16", open: 105, high: 115, low: 100, close: 108 },
    { time: "2025-06-17", open: 108, high: 112, low: 104, close: 110 },
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: "#f9fafb" },
        textColor: "#111827",
      },
      grid: {
        vertLines: { color: "#e5e7eb" },
        horzLines: { color: "#e5e7eb" },
      },
      priceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries();

    const chartData = (data.length > 0 ? data : fallbackData).map((d) => ({
      time: d.time.split("T")[0],
      open: Number(d.open),
      high: Number(d.high),
      low: Number(d.low),
      close: Number(d.close),
    }));

    candleSeries.setData(chartData);

    return () => chart.remove();
  }, [data]);

  return (
    <div>
      <div ref={chartRef} />
      <div className="text-center text-sm text-gray-500 mt-2">
        {data.length > 0
          ? "✅ عرض بيانات الشموع الفعلية"
          : "⚠️ عرض بيانات تجريبية لعدم توفر البيانات الحقيقية"}
      </div>
    </div>
  );
};

export default CandleChart;
