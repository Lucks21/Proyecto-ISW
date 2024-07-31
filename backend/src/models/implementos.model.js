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
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [100, 'La descripción no puede exceder los 100 caracteres']
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad debe ser al menos 1']
  },
  fechaAdquisicion: {
    type: Date,
    required: [true, 'La fecha de adquisición es obligatoria'],
  },
  horarioDisponibilidad: {
    type: [{
      dia: {
        type: String,
        required: [true, 'El día es obligatorio'],
        trim: true
      },
      inicio: {
        type: String,
        required: [true, 'La hora de inicio es obligatoria'],
      },
      fin: {
        type: String,
        required: [true, 'La hora de fin es obligatoria'],
      }
    }],
    default: []
  },
  estado: {
    type: String,
  },
  historialModificaciones: {
    type: [HistorialModificacionesSchema],
    default: []
  }
});

const Implemento = mongoose.models.Implemento || mongoose.model('Implemento', ImplementoSchema);

export default Implemento;
