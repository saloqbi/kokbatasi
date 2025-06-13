import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE}/api/signals`;

export const getSignals = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createSignal = async (signal) => {
  const res = await axios.post(API_URL, signal);
  return res.data;
};
