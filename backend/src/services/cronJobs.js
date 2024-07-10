import cron from 'node-cron';
import axios from 'axios';
import { PORT, HOST, CRON_SECRET} from "../config/configEnv.js";

console.log('=> Cron job configurado');
console.log('CRON_SECRET:', CRON_SECRET);

cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Revisando reservas expiradas...');
  try {
    const response = await axios.get(`http://${HOST}:${PORT}/api/finalizarReservasExpiradas`, {
      headers: {
        'cron-secret': CRON_SECRET
      }
    });
    console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('Error al ejecutar el cron job:', error.message);
  }
});
