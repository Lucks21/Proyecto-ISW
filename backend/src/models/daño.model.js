"use strict";
import mongoose from "mongoose";

const dañoSchema = new mongoose.Schema({
    implementoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Implemento',
        required: true
    },
    instalacionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Instalacion'
    },
    descripcion: {
        type: String,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now,
        required: true
    },
    responsable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    costoReparacion: {
        type: Number,
        required: true
    }
});

const Daño = mongoose.model("Daño", dañoSchema);
export default Daño;
