// frontend/src/pages/ManualSignalPage.jsx

import React, { useState } from "react";

const ManualSignalPage = () => {
  const [symbol, setSymbol] = useState("");
  const [action, setAction] = useState("Buy");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, action }),
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
      <h2 className="text-xl font-bold mb-4">➕ Manual Signal Entry</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Symbol (e.g. AAPL)"
          className="border p-2 w-full"
          required
        />
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="border p-2 w-full"
        >
          <option>Buy</option>
          <option>Sell</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Signal
        </button>
      </form>
    </div>
  );
};

export default ManualSignalPage;
