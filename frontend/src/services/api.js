import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const planTrip = async (tripData) => {
  try {
    const response = await axios.post(`${API_URL}/plan-trip/`, tripData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.error || 'Server error occurred');
    } else if (error.request) {
      throw new Error('Could not connect to server. Make sure the backend is running.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};