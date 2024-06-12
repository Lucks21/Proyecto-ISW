import mongoose from "mongoose";
const reservaSchema = new mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true // indica que el campo es obligatorio
        },
        implementoId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Implementos'
        },
        instalacionId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Instalacion'
        },
        fechaInicio:{
            type: Date,
            required: true
        },
        fechaFin:{
            type: Date
        },
        estado:{
            type: String,
            enum: ['activo','no activo'],
            default: 'activo'
        }
    }
)
const Reserva = mongoose.model("Reserva",reservaSchema);
export default Reserva;