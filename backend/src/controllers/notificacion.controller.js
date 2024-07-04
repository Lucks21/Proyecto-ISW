import { respondError, respondSuccess } from "../utils/resHandler.js";
import NotificacionService from '../services/notificacion.services.js';
import sendEmail from '../utils/emailService.js';

async function solicitarNotificacion(req, res) {
    try {
      const { recursoId, recursoTipo, userId } = req.body;
      const result = await NotificacionService.solicitarNotificacion(recursoId, recursoTipo, userId);
  
      if (result.error) {
        return respondError(req, res, 400, result.error);
      }
  
      //Aqui falta recibir el correo del usuario
      const userEmail = '@alumnos.ubiobio.cl'; 
      const subject = 'Confirmación de solicitud de notificación';
      const text = `Has solicitado una notificación para el recurso ${recursoTipo} con ID ${recursoId}.`;
  
      await sendEmail(userEmail, subject, text);
  
      respondSuccess(req, res, 201, result.message);
    } catch (error) {
      respondError(req, res, 500, "Error al solicitar notificación", error);
    }
  };
  
  export default {
    solicitarNotificacion
  };