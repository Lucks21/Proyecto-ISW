"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import DañoService from "../services/dano.service.js"; // Verifica que la ruta y el nombre sean correctos

async function getDaños(req, res) {
    try {
        const [daños, error] = await DañoService.obtenerDaños();
        if (error) return respondError(req, res, 404, error);

        daños.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, daños);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function createDaño(req, res) {
    try {
        const { body } = req;
        const [daño, error] = await DañoService.registrarDaño(body);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 201, daño);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

export default {
    createDaño,
    getDaños,
};
