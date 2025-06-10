import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllSignals } from '../api/api';

const AllSignals = () => {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const fetchSignals = async () => {
      const data = await getAllSignals();
      setSignals(data);
    };
    fetchSignals();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📡 جميع التوصيات</h2>
      <ul className="space-y-2">
        {signals.map((signal) => (
          <li key={signal._id} className="border p-2 rounded hover:bg-gray-100">
            <Link to={`/signals/${signal._id}`}>
              {signal.symbol} - {signal.action} - {signal.price}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllSignals;