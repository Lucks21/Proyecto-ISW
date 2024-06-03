"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
<<<<<<< HEAD
import DanoService from "../services/dano.service.js";
import { danoSchema } from "../schema/dano.schema.js";
=======
import DanoService from "../services/dano.services.js"; // Verifica que la ruta y el nombre sean correctos
>>>>>>> d7279aa4c2b6a5628cafbd30881652f8f4c7873e

async function getDanos(req, res) {
    try {
        const [danos, error] = await danoService.obtenerdanos();
        if (error) return respondError(req, res, 404, error);

        danos.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, danos);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function createdano(req, res) {
    try {
        const { body } = req;
        const [dano, error] = await danoService.registrardano(body);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 201, dano);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

export default {
    createdano,
    getdanos,
};
<<<<<<< HEAD

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
=======
>>>>>>> d7279aa4c2b6a5628cafbd30881652f8f4c7873e
