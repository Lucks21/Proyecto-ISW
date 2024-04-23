import { respondSuccess, respondError } from "../utils/resHandler.js";
import ImplementoService from "../services/implementos.services.js";

async function getImplementos(req, res) {
    try {
        const [implementos, error] = await ImplementoService.getImplementos();
        if (error) return respondError(req, res, 404, error);

        implementos.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, implementos);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function createImplemento(req, res) {
    try {
        const { body } = req;
        const [implemento, error] = await ImplementoService.createImplemento(body);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 201, implemento);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function updateImplemento(req, res) {
    try {
        const { params, body } = req;
        const [updatedImplemento, error] = await ImplementoService.updateImplemento(params.id, body);

        if (error) return respondError(req, res, 400, error);

        respondSuccess(req, res, 200, updatedImplemento);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function deleteImplemento(req, res) {
    try {
        const { params } = req;
        const [deletedImplemento, error] = await ImplementoService.deleteImplemento(params.id);

        if (error) return respondError(req, res, 404, error);

        respondSuccess(req, res, 200, deletedImplemento);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

async function getImplementoById(req, res) {
    try {
        const { params } = req;
        const [implemento, error] = await ImplementoService.getImplementoById(params.id);

        if (error) {
            return respondError(req, res, 404, error);
        }

        respondSuccess(req, res, 200, implemento);
    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor");
    }
}

export default {
    createImplemento,
    updateImplemento,
    deleteImplemento,
    getImplementos,
    getImplementoById
};