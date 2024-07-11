"use strict";
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Subdocumento para el horario de disponibilidad
const HorarioSchema = new Schema({
  dia: {
    type: String,
    required: true,
  },
  inicio: {
    type: String,
    required: true,
  },
  fin: {
    type: String,
    required: true,
  }
}, );

// Definir el esquema de Instalaciones
const InstalacionSchema = new Schema({
  nombre: {
    type: String,
    required: true, 

    unique: true, // Asegura unicidad del nombre
  },
  descripcion: {
    type: String,
  },
  estado: {
    type: String,
    enum: ['disponible', 'no disponible'],
    default: 'disponible',
  },
  capacidad: {
    type: Number,
    required: true
  },
  fechaAdquisicion: {
    type: Date,
    default: Date.now,
  },
  horarioDisponibilidad: {
    type: [HorarioSchema],
    default: [],
  }
},{
  timestamps: false,
  versionKey: false, // esto es para desactivar la creción del campo '_v' en los documentos
},  
); 

const Instalacion = mongoose.model('Instalacion', InstalacionSchema);

export default Instalacion;
