import dotenv from 'dotenv';
dotenv.config();
import sendEmail from './email.services.js';

const testSendEmail = async () => {
  const to = 'anays.mansilla2001@alumnos.ubiobio.cl';
  const subject = 'Prueba de envío de correo';
  const text = 'Este es un correo de prueba para verificar el servicio de envío de correos.';

  try {
    await sendEmail(to, subject, text);
    console.log('Correo de prueba enviado con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo de prueba:', error);
  }
};

testSendEmail();
