"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import PrestamoService from "../services/prestamo.services.js";

async function getPrestamosActivos(req, res) {
    try {
        const [prestamosActivos, error] = await PrestamoService.obtenerPrestamosActivos();
        if (error) return respondError(req, res, 404, error);

        prestamosActivos.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, prestamosActivos);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function getHistorialPrestamos(req, res) {
    try {
        const { userId } = req.params;
        const [historialPrestamos, error] = await PrestamoService.obtenerHistorialPrestamos(userId);

        if (error) return respondError(req, res, 404, error);

        historialPrestamos.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, historialPrestamos);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

export default {
    getPrestamosActivos,
    getHistorialPrestamos,
};
