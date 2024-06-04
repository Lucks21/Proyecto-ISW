import { respondSuccess, respondError } from "../utils/resHandler.js";
import InstalacionService from "../services/instalacion.services.js";

async function getInstalaciones(req, res) {
    try {
        const [instalaciones, error] = await InstalacionService.getInstalaciones();
        if (error) return respondError(req, res, 404, error);

        instalaciones.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, instalaciones);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function createInstalacion(req, res) {
    try {
        const { body } = req;
        const [instalacion, error] = await InstalacionService.createInstalacion(body);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 201, instalacion);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}


async function updateInstalacion(req, res) {
    try {
        const { params, body } = req;
        const [updatedInstalacion, error] = await InstalacionService.updateInstalacion(params.id, body);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 200, updatedInstalacion);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function deleteInstalacion(req, res) {
    try {
        const { id } = req.params;
        const [deletedInstalacion, error] = await InstalacionService.deleteInstalacion(id);

        if (error) return respondError(req, res, 404, error);

        respondSuccess(req, res, 200, deletedInstalacion);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function getInstalacionById(req, res) {
    try {
        const { params } = req;
        const [instalacion, error] = await InstalacionService.getInstalacionById(params.id);

        if (error) {
            return respondError(req, res, 404, error);
        }

        respondSuccess(req, res, 200, instalacion);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

export default {
    createInstalacion,
    updateInstalacion,
    deleteInstalacion,
    getInstalaciones,
    getInstalacionById
};
