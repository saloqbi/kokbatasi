import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ManualSignal = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    recommendation: "buy",
    price: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.recommendation || !form.price) {
      setError("جميع الحقول مطلوبة");
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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        ➕ إضافة توصية يدوية
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
          placeholder="السعر"
          value={form.price}
          onChange={handleChange}
          className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
        >
          حفظ التوصية
        </button>
      </form>
    </div>
  );
};

export default ManualSignal;
