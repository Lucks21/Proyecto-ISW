"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { dañoSchema } from "../schema/daño.schema.js";
import DañoService from "../services/daño.service.js";

async function registrarDaño(req, res) {
  try {
    const { error } = dañoSchema.validate(req.body);
    if (error) return respondError(req, res, 400, error.details[0].message);

    const [daño, err] = await DañoService.registrarDaño(req.body);
    if (err) return respondError(req, res, 500, err);

    respondSuccess(req, res, 201, daño);
  } catch (error) {
    respondError(req, res, 500, "Error al registrar el daño");
  }
}

async function obtenerDaños(req, res) {
  try {
    const [daños, err] = await DañoService.obtenerDaños();
    if (err) return respondError(req, res, 500, err);

    respondSuccess(req, res, 200, daños);
  } catch (error) {
    respondError(req, res, 500, "Error al obtener los daños");
  }
}

export default { registrarDaño, obtenerDaños };
