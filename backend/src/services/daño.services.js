import Daño from "../models/daño.model.js";

async function registrarDaño(dañoData) {
  try {
    const daño = new Daño(dañoData);
    await daño.save();
    return [daño, null];
  } catch (error) {
    return [null, "Error al registrar el daño"];
  }
}

async function obtenerDaños() {
  try {
    const daños = await Daño.find().populate('implementoId instalacionId responsable');
    return [daños, null];
  } catch (error) {
    return [null, "Error al obtener los daños"];
  }
}

export default {
  registrarDaño,
  obtenerDaños
};