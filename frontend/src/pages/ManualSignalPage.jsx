import React, { useState } from "react";

const ManualSignalPage = () => {
  const [symbol, setSymbol] = useState("");
  const [action, setAction] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, action, data: [] }) // ✅ تم التصحيح هنا
      });
      const result = await response.json();
      alert("✅ Signal added: " + result.symbol);
      setSymbol("");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to add signal");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">إدخال توصية يدوية</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="رمز الأصل (symbol)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">اختر نوع التوصية</option>
          <option value="buy">شراء</option>
          <option value="sell">بيع</option>
          <option value="hold">احتفاظ</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          إضافة التوصية
        </button>
      </form>
    </div>
  );
};

export default ManualSignalPage;