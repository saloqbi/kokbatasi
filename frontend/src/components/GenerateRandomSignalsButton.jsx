
import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GenerateRandomSignalsButton = () => {
  const generateRandomSignals = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/signals/random`, { method: 'POST' });

      const data = await res.json();
      toast.success(`✅ تم توليد ${data.data.length} توصيات بنجاح`, { autoClose: 2000 });
    } catch (err) {
      toast.error('❌ فشل في توليد التوصيات');
    }
  };

  return (
    <button
      onClick={generateRandomSignals}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
    >
      🔄 توليد توصيات عشوائية
    </button>
  );
};

export default GenerateRandomSignalsButton;
