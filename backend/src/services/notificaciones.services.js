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
    let recursoNombre;
    if (recursoTipo === 'implemento') {
      recurso = await Implemento.findById(recursoId);
    } else if (recursoTipo === 'instalacion') {
      recurso = await Instalacion.findById(recursoId);
    }

    if (!recurso) {
      return { error: `Recurso no encontrado para el tipo ${recursoTipo}.` };
    }
    console.log(recurso)
    recursoNombre = recurso.nombre;

    const nuevaNotificacion = new Notificacion({
      recursoId,
      recursoTipo,
      userId,
    });

    await nuevaNotificacion.save();

    const subject = 'Confirmación de solicitud de notificación';
    const text = `Has solicitado una notificación para el recurso ${recursoTipo} con nombre ${recursoNombre}.`;

    await sendEmail(alumno.email, subject, text);

    return { message: `Solicitud de notificación registrada con éxito.` };
  } catch (error) {
    console.error('Error en solicitarNotificacion:', error);
    return { error: 'Error interno del servidor.' };
  }
}

// notificar disponibilidad de implemento
async function notificarDisponibilidadImplemento(implementoId) {
  try {
    const implemento = await Implemento.findById(implementoId);
    if (!implemento) {
      return { error: 'Implemento no encontrado.' };
    }

    const notificaciones = await Notificacion.find({ recursoId: implementoId, recursoTipo: 'implemento' });
    const notificacionesValidas = notificaciones.filter(n => n.userId);

    await Notificacion.deleteMany({ recursoId: implementoId, recursoTipo: 'implemento', userId: null });

    const alumnos = await Alumno.find({ _id: { $in: notificacionesValidas.map(n => n.userId) } }).select('email');

    const subject = 'Disponibilidad de Implemento';
    const text = `El implemento ${implemento.nombre} está ahora disponible.`;

    for (const alumno of alumnos) {
      await sendEmail(alumno.email, subject, text);
    }

    await Notificacion.deleteMany({ recursoId: implementoId, recursoTipo: 'implemento', userId: { $in: notificacionesValidas.map(n => n.userId) } });

    return { message: 'Notificaciones de disponibilidad de implemento enviadas con éxito.' };
  } catch (error) {
    console.error('Error en notificarDisponibilidadImplemento:', error);
    return { error: 'Error interno del servidor.' };
  }
}

// notificar disponibilidad de instalación
async function notificarDisponibilidadInstalacion(instalacionId) {
  try {
    const instalacion = await Instalacion.findById(instalacionId);
    if (!instalacion) {
      return { error: 'Instalación no encontrada.' };
    }

    const notificaciones = await Notificacion.find({ recursoId: instalacionId, recursoTipo: 'instalacion' });
    const notificacionesValidas = notificaciones.filter(n => n.userId);

    await Notificacion.deleteMany({ recursoId: instalacionId, recursoTipo: 'instalacion', userId: null });

    const alumnos = await Alumno.find({ _id: { $in: notificacionesValidas.map(n => n.userId) } }).select('email');

    const subject = 'Disponibilidad de Instalación';
    const text = `La instalación ${instalacion.nombre} está ahora disponible.`;

    for (const alumno of alumnos) {
      await sendEmail(alumno.email, subject, text);
    }

    await Notificacion.deleteMany({ recursoId: instalacionId, recursoTipo: 'instalacion', userId: { $in: notificacionesValidas.map(n => n.userId) } });

    return { message: 'Notificaciones de disponibilidad de instalación enviadas con éxito.' };
  } catch (error) {
    console.error('Error en notificarDisponibilidadInstalacion:', error);
    return { error: 'Error interno del servidor.' };
  }
}

async function verSolicitudesNotificacion() {
  try {
    const solicitudes = await Notificacion.find().populate('userId', 'email');
    return [solicitudes, null];
  } catch (error) {
    console.error('Error en verSolicitudesNotificacion:', error);
    return [null, 'Error interno del servidor.'];
  }
}

export default {
  solicitarNotificacion,
  notificarDisponibilidadImplemento,
  notificarDisponibilidadInstalacion,
  verSolicitudesNotificacion,
};
