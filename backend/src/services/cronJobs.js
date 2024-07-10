import cron from 'node-cron';
import axios from 'axios';
import { CRON_SECRET } from '../config/configEnv.js';

console.log('=> Cron job configurado');

cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Revisando reservas expiradas...');
  try {
    await axios.get('http://localhost:3200/api/finalizarReservasExpiradas', {
      headers: {
        'Cron-Secret': CRON_SECRET
      }
    });
  } catch (error) {
    console.error('Error al ejecutar el cron job:', error.message);
  }
});
