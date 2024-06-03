"use strict";

import Dano from "../models/dano.model.js";

async function registrarDano(danoData) {
  try {
    const dano = new Dano(danoData);
    await dano.save();
    return [dano, null];
  } catch (error) {
    return [null, "Error al registrar el daño"];
  }
}

async function obtenerDanos() {
  try {
    const danos = await Dano.find().populate('implementoId instalacionId responsable');
    return [danos, null];
  } catch (error) {
    return [null, "Error al obtener los daños"];
  }
}

export default {
  registrarDano,
  obtenerDanos
};
