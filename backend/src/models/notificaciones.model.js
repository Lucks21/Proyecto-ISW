"use strict";
import mongoose from "mongoose";
const { Schema } = mongoose;


const NotificacionSchema = new Schema({
  recursoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  recursoTipo: {
    type: String,
    enum: ['implemento', 'instalacion'],
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alumno',
    required: true,
  },
},{
  timestamps: false,
  versionKey: false, // esto es para desactivar la creción del campo '_v' en los documentos
},);

const Notificacion = mongoose.model('Notificacion', NotificacionSchema);

export default Notificacion;
