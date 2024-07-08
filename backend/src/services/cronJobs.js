import cron from 'node-cron';
import ReservaService from './services/reservas.service.js';

console.log('=> Cron job configurado');

// Programar un cron job para ejecutarse cada minuto (puedes ajustar el intervalo según tus necesidades)
cron.schedule('* * * * *', async () => {
  console.log('Cron job ejecutándose: Revisando reservas expiradas...');
  await ReservaService.finalizarReservasExpiradas();
});
