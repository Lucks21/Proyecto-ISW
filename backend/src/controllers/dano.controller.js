"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import DanoService from "../services/dano.services.js"; // Verifica que la ruta y el nombre sean correctos

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
