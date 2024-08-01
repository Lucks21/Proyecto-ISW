import cron from 'node-cron';
import axios from 'axios';
import { PORT, HOST, CRON_SECRET} from "../config/configEnv.js";
import Implemento from '../models/implementos.model.js'; 
import Instalacion from '../models/Instalacion.model.js';
import Notificacion from '../models/notificaciones.model.js';
//este es para finalizar las reservas que expiraron, se esta ejecutando cada 1 minuto
cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Revisando reservas expiradas...');
  try {
    const response = await axios.get(`http://146.83.198.35:80/api/finalizarReservasExpiradas`, {
      headers: {
        'cron-secret': CRON_SECRET
      }
    });
    //console.log('Respuesta del servidor:', response.data);
  } catch (error) {
    console.error('Error al ejecutar el cron job:', error.message);
  }
});

// Notificar disponibilidad de implementos cada 5 minutos
cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Notificando disponibilidad de implementos...');
  try {
    const solicitudesImplementos = await Notificacion.find({ recursoTipo: 'implemento' });
    if (solicitudesImplementos.length > 0) {
      const implementosDisponibles = await Implemento.find({ estado: 'disponible' });
      for (const implemento of implementosDisponibles) {
        await axios.post(`http://146.83.198.35:80/api/notificarImplemento`, 
          { implementoId: implemento._id }, 
          {
            headers: {
              'cron-secret': CRON_SECRET,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
  } catch (error) {
    console.error('Error al notificar disponibilidad de implementos:', error.message);
  }
});

// Notificar disponibilidad de instalaciones cada 5 minutos
cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Notificando disponibilidad de instalaciones...');
  try {
    const solicitudesInstalaciones = await Notificacion.find({ recursoTipo: 'instalacion' });
    if (solicitudesInstalaciones.length > 0) {
      const instalacionesDisponibles = await Instalacion.find({ estado: 'disponible' });
      for (const instalacion of instalacionesDisponibles) {
        await axios.post(`http://146.83.198.35:80/api/notificarInstalacion`, 
          { instalacionId: instalacion._id }, 
          {
            headers: {
              'cron-secret': CRON_SECRET,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    }
  } catch (error) {
    console.error('Error al notificar disponibilidad de instalaciones:', error.message);
  }
});
