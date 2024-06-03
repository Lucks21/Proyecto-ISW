"use strict";

import dano from "../models/dano.model.js";

async function registrardano(danoData) {
    try {
        const dano = new dano(danoData);
        await dano.save();
        return [dano, null];
    } catch (error) {
        return [null, "Error al registrar el dano"];
    }
}

async function obtenerdanos() {
    try {
        const danos = await dano.find().populate('implementoId instalacionId responsable');
        return [danos, null];
    } catch (error) {
        return [null, "Error al obtener los danos"];
    }
}

export default {
    registrardano,
    obtenerdanos
};
