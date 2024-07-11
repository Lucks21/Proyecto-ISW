"use strict";
// Importa el modulo 'mongoose' para crear la conexion a la base de datos
import { Schema, model } from "mongoose";
import ROLES from "../constants/roles.constants.js";

// Crea el esquema de la coleccion 'roles'
const roleSchema = new Schema(
  {
    name: {
      type: String,
      enum: ROLES,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false, // esto es para desactivar la creción del campo '_v' en los documentos
  },
);

// Crea el modelo de datos 'Role' a partir del esquema 'roleSchema'
const Role = model("Role", roleSchema);

export default Role;
