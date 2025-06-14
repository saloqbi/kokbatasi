import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllSignalsPage = () => {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');

  const fetchSignals = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/webhook/signals`);
      setSignals(res.data);
    } catch (err) {
      setError('فشل في جلب البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const filteredSignals = signals.filter(signal =>
    signal.title?.toLowerCase().includes(filter.toLowerCase()) ||
    signal.recommendation?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📡 جميع التوصيات</h2>

      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="🔍 فلترة حسب العنوان أو التوصية"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>

      {loading ? (
        <p>⏳ جاري التحميل...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">#</th>
              <th className="border p-2">📌 العنوان</th>
              <th className="border p-2">📊 التوصية</th>
              <th className="border p-2">🕒 التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filteredSignals.map((signal, index) => (
              <tr key={signal._id || index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{signal.title || '-'}</td>
                <td className="border p-2">{signal.recommendation || '-'}</td>
                <td className="border p-2">
                  {new Date(signal.createdAt).toLocaleString('ar-EG')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllSignalsPage;
