"use strict";

import Reserva from "../models/reserva.model.js";

async function obtenerPrestamosActivos() {
    try {
        const prestamosActivos = await Reserva.find({ estado: 'disponible' }).populate('usuarioId implementoId instalacionId');
        return [prestamosActivos, null];
    } catch (error) {
        return [null, "Error al obtener los préstamos activos"];
    }
}

async function obtenerHistorialPrestamos(userId) {
    try {
        const historialPrestamos = await Reserva.find({ usuarioId: userId, estado: { $ne: 'disponible' } }).populate('usuarioId implementoId instalacionId');
        return [historialPrestamos, null];
    } catch (error) {
        return [null, "Error al obtener el historial de préstamos"];
    }
}

export default {
    obtenerPrestamosActivos,
    obtenerHistorialPrestamos
};
