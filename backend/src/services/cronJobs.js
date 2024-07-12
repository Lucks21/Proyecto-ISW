import cron from 'node-cron';
import axios from 'axios';
import { PORT, HOST, CRON_SECRET} from "../config/configEnv.js";
import Implemento from '../models/implementos.model.js'; 
import Instalacion from '../models/Instalacion.model.js';

//este es para finalizar las reservas que expiraron, se esta ejecutando cada 1 minuto
cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Revisando reservas expiradas...');
  try {
    const response = await axios.get(`http://${HOST}:${PORT}/api/finalizarReservasExpiradas`, {
      headers: {
        'cron-secret': CRON_SECRET
      }
    });
    //console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('Error al ejecutar el cron job:', error.message);
  }
});
/* se ejecuta para notificar la disponibilidad cada 5 minutos
cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Notificando disponibilidad de implementos...');
  try {
    const implementosDisponibles = await Implemento.find({ estado: 'disponible' });
    
    for (const implemento of implementosDisponibles) {
      await axios.post(`http://${HOST}:${PORT}/api/notificarImplemento`, 
        { implementoId: implemento._id }, 
        {
          headers: {
            'cron-secret': CRON_SECRET,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error('Error al notificar disponibilidad de implementos:', error.message);
  }
});
// se ejecuta para notificar la disponibilidad cada 5 minutos
cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Notificando disponibilidad de instalaciones...');
  try {
    const instalacionesDisponibles = await Instalacion.find({ estado: 'disponible' });

    for (const instalacion of instalacionesDisponibles) {
      await axios.post(`http://${HOST}:${PORT}/api/notificarInstalacion`, 
        { instalacionId: instalacion._id }, 
        {
          headers: {
            'cron-secret': CRON_SECRET,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error('Error al notificar disponibilidad de instalaciones:', error.message);
  }
});  


*/
