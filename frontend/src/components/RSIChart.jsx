
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const RSIChart = () => {
  const data = {
    labels: Array.from({ length: 14 }, (_, i) => `T${i+1}`),
    datasets: [
      {
        label: "RSI",
        data: [34, 40, 45, 48, 52, 55, 58, 60, 62, 64, 66, 70, 68, 65],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: { min: 0, max: 100 },
    },
  };

  return (
    <div className="my-6">
      <h3 className="text-lg font-bold mb-2">📊 مؤشر RSI</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default RSIChart;
