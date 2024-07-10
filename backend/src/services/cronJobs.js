import cron from 'node-cron';
import ReservaService from './services/Reserva.services.js';

console.log('=> Cron job configurado');


cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Revisando reservas expiradas...');
  await ReservaService.finalizarReservasExpiradas();
});
