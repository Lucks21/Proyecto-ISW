import nodemailer from 'nodemailer';
import { EMAIL_USER, EMAIL_PASS } from '../config/configEnv.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

async function sendEmail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"Proyecto ingenieria de software👻" <${EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function enviarCorreoCancelacion(destinatario, implementoOInstalacion, fecha) {
  try {
    const info = await transporter.sendMail({
      from: `"Proyecto ingenieria de software👻" <${EMAIL_USER}>`,
      to: destinatario,
      subject: "Reserva cancelada",
      text: `Su reserva de "${implementoOInstalacion}" ha sido cancelada para el día ${fecha} porque el día ha sido deshabilitado.`,
    });
    console.log("Correo enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo: ", error);
    throw error;
  }
}

export default sendEmail;
