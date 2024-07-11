import Notificacion from '../models/notificaciones.model.js';
import Alumno from '../models/alumno.model.js';
import Implemento from '../models/implementos.model.js';
import Instalacion from '../models/Instalacion.model.js';
import sendEmail from './email.services.js';

// solicitar una notificacion
async function solicitarNotificacion(recursoId, recursoTipo, userId) {
  try {
    const alumno = await Alumno.findById(userId);
    if (!alumno) {
      return { error: 'Alumno no encontrado.' };
    }

    let recurso;
    if (recursoTipo === 'implemento') {
      recurso = await Implemento.findById(recursoId);
    } else if (recursoTipo === 'instalacion') {
      recurso = await Instalacion.findById(recursoId);
    }

    if (!recurso) {
      return { error: `Recurso no encontrado para el tipo ${recursoTipo}.` };
    }
    
    const nuevaNotificacion = new Notificacion({
      recursoId,
      recursoTipo,
      userId,
    });

    await nuevaNotificacion.save();
    return { message: 'Solicitud de notificación registrada con éxito.' };
  } catch (error) {
    console.error('Error en solicitarNotificacion:', error);
    return { error: 'Error interno del servidor.' };
  }
}

//notificar disponibilidad de implemento
async function notificarDisponibilidadImplemento(implementoId) {
  try {
    const implemento = await Implemento.findById(implementoId);
    if (!implemento) {
      return { error: 'Implemento no encontrado.' };
    }

    const notificaciones = await Notificacion.find({ recursoId: implementoId, recursoTipo: 'implemento' });
    const emails = await Alumno.find({ _id: { $in: notificaciones.map(n => n.userId) } }).select('email');

    const subject = 'Disponibilidad de Implemento';
    const text = `El implemento ${implemento.nombre} está ahora disponible.`;

    for (const email of emails) {
      await sendEmail(email.email, subject, text);
    }

    return { message: 'Notificaciones de disponibilidad de implemento enviadas con éxito.' };
  } catch (error) {
    console.error('Error en notificarDisponibilidadImplemento:', error);
    return { error: 'Error interno del servidor.' };
  }
}

//notificar disponibilidad de instalación
async function notificarDisponibilidadInstalacion(instalacionId) {
  try {
    const instalacion = await Instalacion.findById(instalacionId);
    if (!instalacion) {
      return { error: 'Instalación no encontrada.' };
    }

    const notificaciones = await Notificacion.find({ recursoId: instalacionId, recursoTipo: 'instalacion' });
    const emails = await Alumno.find({ _id: { $in: notificaciones.map(n => n.userId) } }).select('email');

    const subject = 'Disponibilidad de Instalación';
    const text = `La instalación ${instalacion.nombre} está ahora disponible.`;

    for (const email of emails) {
      await sendEmail(email.email, subject, text);
    }

    return { message: 'Notificaciones de disponibilidad de instalación enviadas con éxito.' };
  } catch (error) {
    console.error('Error en notificarDisponibilidadInstalacion:', error);
    return { error: 'Error interno del servidor.' };
  }
}

export default {
  solicitarNotificacion,
  notificarDisponibilidadImplemento,
  notificarDisponibilidadInstalacion,
};
