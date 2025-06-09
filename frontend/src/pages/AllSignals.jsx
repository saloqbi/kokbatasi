import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function AllSignals() {
  const [signals, setSignals] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [action, setAction] = useState('');
  const [socket] = useState(io('http://localhost:6060'));

  const fetchSignals = () => {
    let query = '';
    if (symbol) query += `symbol=${symbol}`;
    if (action) query += `${query ? '&' : ''}action=${action}`;
    fetch(`http://localhost:6060/webhook/signals?${query}`)
      .then(res => res.json())
      .then(data => setSignals(data))
      .catch(err => console.error("فشل تحميل الإشارات:", err));
  };

  useEffect(() => {
    fetchSignals();
    socket.on('new-signal', () => fetchSignals());
    return () => socket.disconnect();
  }, [symbol, action]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📡 إشارات TradingView</h2>

      <div className="mb-4 flex gap-4">
        <input className="border p-2" placeholder="الرمز (مثال: BTCUSD)" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        <select className="border p-2" value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">الكل</option>
          <option value="buy">شراء</option>
          <option value="sell">بيع</option>
        </select>
        <button onClick={fetchSignals} className="bg-blue-500 text-white px-4 py-2 rounded">🔄 تحديث</button>
      </div>

      {signals.length === 0 ? <p>⚠️ لا توجد إشارات</p> : (
        <ul className="space-y-4">
          {signals.map((sig, idx) => (
            <li key={idx} className="border p-4 rounded shadow">
              <p><strong>📈 الأصل:</strong> {sig.symbol}</p>
              <p><strong>📊 التوصية:</strong> {sig.action}</p>
              <p><strong>💰 السعر:</strong> {sig.price}</p>
              <p><strong>🕒 الوقت:</strong> {new Date(sig.time).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
