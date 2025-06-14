import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE}/api/signals`;

export const getSignals = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    console.error('❌ Error fetching signals:', error);
    return [];
  }
};

export const createSignal = async (signal) => {
  try {
    const res = await axios.post(API_URL, signal);
    return res.data;
  } catch (error) {
    console.error('❌ Error creating signal:', error);
    return null;
  }
};
