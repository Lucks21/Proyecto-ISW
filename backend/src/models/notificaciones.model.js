"use strict";
import mongoose from "mongoose";
const { Schema } = mongoose;


const NotificacionSchema = new Schema({
  recursoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'El ID del recurso es obligatorio'],
  },
  recursoTipo: {
    type: String,
    enum: ['implemento', 'instalacion'],
    required: [true, 'El tipo de recurso es obligatorio'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumno',
    required: [true, 'El ID del usuario es obligatorio'],
  },
},{
  timestamps: false,
  versionKey: false, // esto es para desactivar la creción del campo '_v' en los documentos
},);

const Notificacion = mongoose.model('Notificacion', NotificacionSchema);

export default Notificacion;
