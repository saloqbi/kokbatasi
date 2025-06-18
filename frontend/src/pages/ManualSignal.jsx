import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSignal } from "../api/signals"; // ✅ استيراد الدالة

const ManualSignal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    recommendation: "buy",
    price: "",
    data: [{ time: "", open: "", high: "", low: "", close: "" }],
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDataChange = (index, key, value) => {
    const newData = [...form.data];
    newData[index][key] = value;
    setForm({ ...form, data: newData });
  };

  const addDataPoint = () => {
    setForm({
      ...form,
      data: [...form.data, { time: "", open: "", high: "", low: "", close: "" }],
    });
  };

  const removeDataPoint = (index) => {
    const newData = form.data.filter((_, i) => i !== index);
    setForm({ ...form, data: newData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.recommendation || !form.price) {
      setError("جميع الحقول الأساسية مطلوبة");
      return;
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_REACT_APP_API_URL + "/api/signals",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (response.ok) {
        navigate("/admin-dashboard");
      } else {
        setError("فشل في الإرسال");
      }
    } catch (err) {
      console.error("❌ فشل:", err);
      setError("حدث خطأ أثناء الإرسال");
    }
  };

  // ✅ زر إنشاء توصية وهمية
  const handleCreateMockSignal = async () => {
    const mockData = [
      { time: "2024-01-01", open: 100, high: 105, low: 98, close: 104 },
      { time: "2024-01-02", open: 104, high: 107, low: 102, close: 106 },
      { time: "2024-01-03", open: 106, high: 108, low: 105, close: 107 },
      { time: "2024-01-04", open: 107, high: 110, low: 106, close: 109 },
      { time: "2024-01-05", open: 109, high: 112, low: 108, close: 111 },
      { time: "2024-01-06", open: 111, high: 113, low: 110, close: 112 },
      { time: "2024-01-07", open: 112, high: 115, low: 111, close: 114 },
    ];

    const newSignal = {
      symbol: "AAPL",
      action: "buy",
      type: "long",
      price: 111,
      lines: [],
      zones: [],
      fractals: [],
      waves: [],
      data: mockData,
    };

    const result = await createSignal(newSignal);
    if (result) {
      alert(`✅ تم إنشاء التوصية بنجاح\nID: ${result._id}`);
      window.open(`/signals/${result._id}`, "_blank");
    } else {
      alert("❌ فشل في إنشاء التوصية");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        ➕ إضافة توصية مع بيانات شموع
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="عنوان التوصية"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
        />

        <select
          name="recommendation"
          value={form.recommendation}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
        >
          <option value="buy">شراء</option>
          <option value="sell">بيع</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="السعر الرئيسي"
          value={form.price}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
        />

        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
            📊 بيانات الشموع (Candlestick Data)
          </h3>
          {form.data.map((point, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-center mb-2">
              <input
                type="text"
                placeholder="الوقت"
                value={point.time}
                onChange={(e) => handleDataChange(index, "time", e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Open"
                value={point.open}
                onChange={(e) => handleDataChange(index, "open", e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="High"
                value={point.high}
                onChange={(e) => handleDataChange(index, "high", e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Low"
                value={point.low}
                onChange={(e) => handleDataChange(index, "low", e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <input
                type="number"
                placeholder="Close"
                value={point.close}
                onChange={(e) => handleDataChange(index, "close", e.target.value)}
                className="p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeDataPoint(index)}
                className="text-red-500 hover:text-red-700"
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addDataPoint}
            className="text-sm text-blue-600 hover:underline mt-1"
          >
            + إضافة نقطة جديدة
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
        >
          حفظ التوصية
        </button>
      </form>

      {/* ✅ زر اختبار سريع */}
      <hr className="my-6 border-t border-gray-300" />
      <button
        onClick={handleCreateMockSignal}
        className="w-full bg-indigo-600 text-white p-3 rounded hover:bg-indigo-700"
      >
        🔁 إنشاء توصية وهمية (مع بيانات جاهزة)
      </button>
    </div>
  );
};

export default ManualSignal;
