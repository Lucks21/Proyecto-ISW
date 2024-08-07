// backend/src/models/reservas.model.js
"use strict";
import mongoose from "mongoose";

const reservaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'El ID del usuario es obligatorio'],
    },
    implementoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Implemento',
      required: function() { return !this.instalacionId; }  // solo va a ser requerido si instalacionId no está
    },
    instalacionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instalacion',
      required: function() { return !this.implementoId; } // lo mismo que con implemento
    },
    fechaInicio: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
    },
    fechaFin: {
      type: Date,
    },
    
    estado: {
      // activo: reservaron
      // inactivo: se termino de usar la instalacion o implemento
      type: String,
      enum: ["activo", "no activo"],
      default: "activo",
    },
    extendida: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: false,
    versionKey: false, // esto es para desactivar la creción del campo '_v' en los documentos
  },
);

const Reserva = mongoose.model("Reserva", reservaSchema);
export default Reserva;
