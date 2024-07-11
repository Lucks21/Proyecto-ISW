import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema para el historial de modificaciones
const HistorialModificacionesSchema = new Schema({
  fecha: {
    type: String,
    required: true,
  },
  campo: {
    type: String,
    required: true,
  },
  valorAnterior: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  valorNuevo: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  motivo: {
    type: String,
  }
});

// Esquema de Instalación
const InstalacionSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
  },
  fechaAdquisicion: {
    type: Date,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  horarioDisponibilidad: {
    type: [{
      dia: {
        type: String,
        required: true,
        enum: ['lunes', 'martes', 'miércoles', 'jueves', 'viernes']
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
    }],
    default: []
  },
  estado: {
    type: String,
    enum: ['disponible', 'no disponible'],
    default: 'disponible',
  },
  historialModificaciones: {
    type: [HistorialModificacionesSchema],
    default: []
  }
});

const Instalacion = mongoose.models.Instalacion || mongoose.model('Instalacion', InstalacionSchema);

export default Instalacion;
