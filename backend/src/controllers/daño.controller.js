import Daño from "../models/daño.model.js";
import Implemento from "../models/implementos.model.js";
import Instalacion from "../models/Instalacion.model.js";
import { respondSuccess, respondError } from "../utils/resHandler.js";

async function registrarDaño(req, res) {
  try {
    const { implementoId, instalacionId, descripcion, responsable, costoReparacion } = req.body;

    let objeto;
    if (implementoId) {
      objeto = await Implemento.findById(implementoId);
      if (objeto) {
        objeto.estado = "no disponible";
      }
    } else if (instalacionId) {
      objeto = await Instalacion.findById(instalacionId);
      if (objeto) {
        objeto.estado = "no disponible";
      }
    }

    if (!objeto) {
      return respondError(req, res, 404, "Implemento o Instalación no encontrado");
    }

    await objeto.save();

    const daño = new Daño({ implementoId, instalacionId, descripcion, responsable, costoReparacion });
    await daño.save();

    return respondSuccess(req, res, 201, "Daño registrado con éxito");
  } catch (error) {
    return respondError(req, res, 500, "Error al registrar el daño");
  }
}

export default { registrarDaño };
