import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CandleChart = ({ data }) => {
  const chartRef = useRef();

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

    const formatted = data.map((d) => ({
      time: d.time, // example: "2024-06-15" or timestamp
      open: Number(d.open),
      high: Number(d.high),
      low: Number(d.low),
      close: Number(d.close),
    }));

    candleSeries.setData(formatted);

    return () => chart.remove();
  }, [data]);

  return <div ref={chartRef} />;
};

export default CandleChart;
