import cron from 'node-cron';
import axios from 'axios';

export default (req, res) => {
  if (req.method === 'POST') {
    cron.schedule('0 9 * * *', async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROOT}/api/1/events/send-class-reminders/`);
        // Handle the response data as needed
      } catch (error) {
        console.error("Error fetching data", error);
      }
    });

    res.status(200).json({ message: 'Cron job scheduled.' });
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
};