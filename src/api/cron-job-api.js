import axios from 'axios';

export const cronJobApi = {
  scheduleCronJob: async () => {
    try {
      const response = await axios.post('/api/schedule');
      return response.data.message;
    } catch (error) {
      console.error("Error scheduling cron job", error);
    }
  }
};