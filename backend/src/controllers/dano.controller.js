"use strict";

const { respondSuccess, respondError } = require("../utils/resHandler.js");
const DanoService = require("../services/dano.service.js");
const { danoSchema } = require("../schema/dano.schema.js");

// Registrar un nuevo daño
const registrarDano = async (req, res) => {
  try {
    const { error } = danoSchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.details[0].message);

    const [dano, err] = await DanoService.registrarDano(req.body);
    if (err) return respondError(req, res, 500, err);

    respondSuccess(req, res, 201, dano);
  } catch (error) {
    respondError(req, res, 500, "Error al registrar el daño");
  }
};

// Obtener todos los daños
const obtenerDanos = async (req, res) => {
  try {
    const [danos, err] = await DanoService.obtenerDanos();
    if (err) return respondError(req, res, 500, err);

    respondSuccess(req, res, 200, danos);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener los daños");
  }
};

export default { registrarDano, obtenerDanos };
