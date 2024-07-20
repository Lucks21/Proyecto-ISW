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
  capacidad: {
    type: Number,
    required: true,
  },
  horarioDisponibilidad: {
    type: [{
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
