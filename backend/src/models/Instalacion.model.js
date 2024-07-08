"use strict";
import mongoose from 'mongoose';

const { Schema } = mongoose;

// Subdocumento para el horario de disponibilidad
const HorarioSchema = new Schema({
  dia: {
    type: String,
    required: true,
    enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  },
  inicio: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // HH:MM format
      },
      message: 'La hora de inicio debe estar en formato HH:MM'
    }
  },
  fin: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value); // HH:MM format
      },
      message: 'La hora de fin debe estar en formato HH:MM'
    }
  }
}, { _id: false });

// Definir el esquema de Instalaciones
const InstalacionSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    set: (value) => value.toLowerCase(),
    unique: true, // Asegura unicidad del nombre
  },
  descripcion: {
    type: String,
    trim: true,
    set: (value) => value.toLowerCase(),
  },
  estado: {
    type: String,
    enum: ['disponible', 'no disponible'],
    default: 'disponible',
    set: (value) => value.toLowerCase(),
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad debe ser al menos 1'],
  },
  fechaAdquisicion: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function (value) {
        return value <= Date.now();
      },
      message: 'La fecha de adquisición no puede ser una fecha futura',
    },
  },
  horarioDisponibilidad: {
    type: [HorarioSchema],
    default: [],
    validate: {
      validator: function (array) {
        // Validate that there are no overlapping times for the same day
        const days = array.map(item => item.dia);
        return days.length === new Set(days).size;
      },
      message: 'No puede haber horarios superpuestos para el mismo día'
    }
  }
}, { timestamps: true }); // Habilitar timestamps

const Instalacion = mongoose.model('Instalacion', InstalacionSchema);

export default Instalacion;
