import { respondSuccess, respondError } from "../utils/resHandler.js";
import PrestamoService from '../services/prestamo.service.js'

async function getAllPrestamosByUser(req, res) {    
    
    const { params } = req;

    try {
        const [prestamos, error] = await PrestamoService.getAllPrestamosByUser(params.id);
        
        if (error) return respondError(req, res, 404, error);

        prestamos.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, prestamos);

    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor prestamos");
    }

}

async function getAllPrestamosActivos(req, res) {
    try {
        const [prestamos, error] = await PrestamoService.getAllPrestamosActivos();
        
        if (error) return respondError(req, res, 404, error);

        prestamos.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, prestamos);

    } catch (error) {
        respondError(req, res, 500, "Error interno del servidor prestamos");
    }
}

export default {
    getAllPrestamosByUser,
    getAllPrestamosActivos
};