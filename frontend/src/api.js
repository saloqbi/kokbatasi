const API_BASE = import.meta.env.VITE_API_URL;

export const fetchSignals = async () => {
  const res = await fetch(`${API_BASE}/api/signals`);
  const data = await res.json();
  return data;
};
