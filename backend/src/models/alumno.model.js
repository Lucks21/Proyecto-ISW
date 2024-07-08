"use strict";
import mongoose from "mongoose";

const { Schema } = mongoose;

const alumnoSchema = new Schema(
  {
    rut: {
      type: String,
      unique: true,
      required: true,
      match: [/^\d{1,2}\.\d{3}\.\d{3}-[kK\d]{1}$/, 'El RUT no es válido']
    },
    contraseña: {
      type: String,
      required: true,
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    correoElectronico: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@alumnos\.ubiobio\.cl$/, 'El correo electrónico debe ser del dominio @alumnos.ubiobio.cl']
    },
    reservasActivas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
    historialReservas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
  },
  {
    versionKey: false, // Desactivar la creación del campo '__v' en los documentos
  },
);

const Alumno = mongoose.model("Alumno", alumnoSchema);

export default Alumno;
