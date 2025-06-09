import React, { useState } from 'react';

export default function SmartSignalGenerator() {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSmartSignal = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/generate-signal');
      const data = await response.json();
      setRecommendation(data);
    } catch (err) {
      console.error(err);
      setError('فشل الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 text-right bg-white dark:bg-gray-900 dark:text-white rounded shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧠 توليد توصية ذكية من ChatGPT</h2>
      <button
        onClick={generateSmartSignal}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? '...جاري التوليد' : 'توليد توصية الآن'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {recommendation && (
        <div className="border-t pt-4 mt-4 text-sm leading-relaxed">
          <p><strong>🕒 التوقيت:</strong> {new Date(recommendation.time).toLocaleString()}</p>
          <p><strong>📈 التوصية:</strong> {recommendation.signal}</p>
        </div>
      )}
    </div>
  );
}
