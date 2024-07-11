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

// Esquema de Implemento
const ImplementoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
  },
  descripcion: {
    type: String,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  fechaAdquisicion: {
    type: Date,
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

const Implemento = mongoose.models.Implemento || mongoose.model('Implemento', ImplementoSchema);

export default Implemento;
