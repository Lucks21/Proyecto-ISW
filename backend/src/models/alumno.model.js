"use strict";
// Import the 'mongoose' module to create the database connection
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const alumnoSchema = new Schema({
        rut: { 
            type: String, 
            unique: true, 
            required: true 
        },
        contraseña: { 
            type: String, 
            required: true 
        },
        nombre: { 
            type: String 
        },
        correoElectronico: { 
            type: String 
        },
        prestamosActivos: [{ 
            type: Schema.Types.ObjectId, 
            ref: 'Reserva' 
        }],
        historialPrestamos: [{
            type: Schema.Types.ObjectId, 
            ref: 'Reserva' 
        }]
    } 
);
const Alumno = mongoose.model("alumno",danoSchema);
export default Alumno;