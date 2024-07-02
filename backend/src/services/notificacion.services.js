import Notificacion from "../models/notificacion.model.js";
import Implemento from "../models/implementos.model.js";
import Instalacion from "../models/Instalacion.model.js";

async function solicitarNotificacion  (recursoId, recursoTipo, userId){
  try {
    recursoTipo = recursoTipo.charAt(0).toUpperCase() + recursoTipo.slice(1);

    let recurso;
    if (recursoTipo === "Implemento") {
      recurso = await Implemento.findById(recursoId);
    } else if (recursoTipo === "Instalacion") {
      recurso = await Instalacion.findById(recursoId);
    } else {
      return { error: "Tipo de recurso no válido" };
    }

    if (!recurso || recurso.estado === "disponible") {
      return { error: "El recurso ya está disponible" };
    }

    const notificacion = new Notificacion({ userId, recursoId, recursoTipo });
    await notificacion.save();

    return { message: "Solicitud de notificación realizada con éxito" };
  } catch (error) {
    return { error: "Error al solicitar notificación", details: error.message };
  }
};
export default {
    solicitarNotificacion
  };
