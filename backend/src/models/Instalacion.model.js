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
    required: [true, 'El nombre es obligatorio'],
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
  fechaAdquisicion: {
    type: Date,
    required: [true, 'La fecha de adquisición es obligatoria'],
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad debe ser al menos 1'],
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
