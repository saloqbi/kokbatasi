const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SIGNAL_API = `${BASE_URL}/api/signals`;

const API_BASE = import.meta.env.VITE_API_URL;

export const getAllSignals = async () => {
  const res = await fetch(`${API_BASE}/api/signals`);
  return res.json();
};

export const getSignalById = async (id) => {
  const res = await fetch(`${API_BASE}/api/signals/${id}`);
  return res.json();
};

export const postSignal = async (data) => {
  const res = await fetch(`${API_BASE}/api/signals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
};