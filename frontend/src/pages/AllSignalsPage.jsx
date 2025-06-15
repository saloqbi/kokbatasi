import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_REACT_APP_API_URL + "/api/signals"
        );
        const data = await response.json();
        console.log("📡 الإشارات المستلمة:", data);
        setSignals(data);
      } catch (error) {
        console.error("❌ فشل في جلب الإشارات:", error);
      }
    };

    fetchSignals();
  }, []);

  const filteredSignals =
    filter === "all"
      ? signals
      : signals.filter((signal) => signal.recommendation?.toLowerCase() === filter);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <span role="img" aria-label="satellite">📡</span> جميع التوصيات
        </h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="all">الكل</option>
          <option value="buy">شراء</option>
          <option value="sell">بيع</option>
