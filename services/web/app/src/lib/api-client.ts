// src/lib/api-client.ts
import axios from 'axios';
import { auth } from '@/lib/firebase'; // Your Firebase auth instance

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://ualgcantina-api-847590019108.europe-west1.run.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        console.log('ID token:', token);
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error('Error getting ID token:', error);
        // Handle error, e.g., by redirecting to login or showing a message
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
