import { respondSuccess, respondError } from "../utils/resHandler.js";
import ReservaService from '../services/reservas.service.js'

async function getAllReservasByUser(req, res) {    
    
    const { params } = req;

    try {
        const [reservas, error] = await ReservaService.getAllReservasByUser(params.id);
        
        if (error) return respondError(req, res, 404, error);

        reservas.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, reservas);

    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor reservas");
    }

}

async function getAllReservasActivos(req, res) {
    try {
        const [reservas, error] = await ReservaService.getAllReservasActivos();
        
        if (error) return respondError(req, res, 404, error);

        reservas.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, reservas);

    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor reservas");
    }
}

export default {
    getAllReservasByUser,
    getAllReservasActivos
};