
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchSignals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/signals`);
      setSignals(res.data);
    } catch (err) {
      setError('فشل في جلب البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomSignals = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/api/signals/random`);
      fetchSignals(); // تحديث القائمة بعد التوليد
    } catch (err) {
      console.error('فشل في توليد التوصيات:', err);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const filteredSignals = signals.filter(signal =>
    signal.symbol.toLowerCase().includes(filter.toLowerCase()) ||
    signal.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📡 جميع التوصيات</h2>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="🔍 فلترة حسب الرمز أو التوصية"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <button
          onClick={generateRandomSignals}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🎲 توليد توصيات عشوائية
        </button>
      </div>

      {loading ? (
        <p>⏳ جاري التحميل...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">🆔</th>
              <th className="border p-2">الرمز</th>
              <th className="border p-2">السعر</th>
              <th className="border p-2">النوع</th>
              <th className="border p-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filteredSignals.map((signal, index) => (
              <tr key={signal._id || index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{signal.symbol}</td>
                <td className="border p-2">{signal.price}</td>
                <td className="border p-2">{signal.type}</td>
                <td className="border p-2">{signal.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllSignalsPage;
