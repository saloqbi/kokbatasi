// frontend/src/services/signalsService.js
import api from '../api/api';

export const getAllSignals = async () => {
  try {
    const response = await api.get('/signals');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching signals:', error);
    throw error;
  }
};
