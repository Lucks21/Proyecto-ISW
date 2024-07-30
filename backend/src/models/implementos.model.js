import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema para el historial de modificaciones
const HistorialModificacionesSchema = new Schema({
  fecha: {
    type: String,
  },
  campo: {
    type: String,
  },
  valorAnterior: {
    type: mongoose.Schema.Types.Mixed,
  },
  valorNuevo: {
    type: mongoose.Schema.Types.Mixed,
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
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  cantidad: {
    type: Number,
    required: true,
  },
  fechaAdquisicion: {
    type: Date,
    required: function() {
      return this.isNew || this.isModified('fechaAdquisicion');
    },
  },
  horarioDisponibilidad: {
    type: [{
      dia: {
        type: String,
        trim: true,
      },
      inicio: {
        type: String,
      },
      fin: {
        type: String,
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
