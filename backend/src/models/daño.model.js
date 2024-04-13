"use strict";
// Import the 'mongoose' module to create the database connection
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const dañoSchema = new mongoose.Schema(
    {
        implementoId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Implemento',
            required: true
        },
        descripcion:{
            type: String,
            required: true
        },
        fechaRegistro:{
            type: String,
            required: true
        },
        responsable:{
            type: mongoose.Schema.Types.ObjectId, //se referencia al alumno que hizo el daño
        }
    }
)

const Daño = mongoose.model("Daño",dañoSchema);
export default Daño;