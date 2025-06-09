// frontend/src/Signals.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'https://kokbatasi-api.onrender.com';

function Signals() {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/signals`);
        setSignals(response.data);
      } catch (error) {
        console.error('❌ Error fetching signals:', error);
      }
    };

    fetchSignals();
  }, []);

  return (
    <div>
      <h1>Signals</h1>
      <ul>
        {signals.map((signal) => (
          <li key={signal.id || signal._id}>{signal.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Signals;
