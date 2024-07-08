"use strict";
import mongoose from "mongoose";
const reservaSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // esto indica que el campo es obligatorio
    },
    implementoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Implementos',
      required: function() { return !this.instalacionId; }  //solo va a ser requerido si instalacionID no está
    },
    instalacionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instalacion',
      required: function() { return !this.implementoId; } //lo mismo que con implemento
    },
    fechaInicio: {
      type: Date,
      required: false,
    },
    fechaFin: {
      type: Date,
    },
    estado: {
      //activo: reservaron
      //inactivo: se termino de usar la instalacion o implemento
      type: String,
      enum: ["activo", "no activo"],
      default: "activo",
    },
  },
  {
    timestamps: true,
    versionKey: false, //esto es para desactivar la crecion del campo '_v' en los documentos
  },
);
const Reserva = mongoose.model("Reserva", reservaSchema);
export default Reserva;
