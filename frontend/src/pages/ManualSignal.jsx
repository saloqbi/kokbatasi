import React, { useState } from 'react';
import { postSignal } from '../api/api';

const ManualSignal = () => {
  const [symbol, setSymbol] = useState('');
  const [action, setAction] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newSignal = { symbol, action, price };
    await postSignal(newSignal);
    alert('تم إرسال التوصية بنجاح');
    setSymbol(''); setAction(''); setPrice('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">✍️ إدخال توصية يدوية</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" placeholder="الأصل (مثال: TASI)" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="border p-2 w-full" />
        <input type="text" placeholder="العملية (شراء/بيع)" value={action} onChange={(e) => setAction(e.target.value)} className="border p-2 w-full" />
        <input type="number" placeholder="السعر" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">إرسال</button>
      </form>
    </div>
  );
};

export default ManualSignal;