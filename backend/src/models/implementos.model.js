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

// Subdocumento para el historial de modificaciones
const HistorialModificacionesSchema = new Schema({
  fecha: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{2}-\d{2}-\d{4}$/.test(value); // DD-MM-YYYY format
      },
      message: 'La fecha debe estar en formato DD-MM-YYYY'
    }
  },
  cantidadModificada: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return typeof value === 'number';
      },
      message: 'La cantidad modificada debe ser un número'
    }
  },
  nuevoStock: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        return typeof value === 'number';
      },
      message: 'El nuevo stock debe ser un número'
    }
  },
  motivo: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

// Definir el esquema de Implementos
const ImplementoSchema = new Schema({
  nombre: {
    type: String,
    required: [false, 'El nombre es obligatorio'],
    trim: true,
    set: (value) => value.toLowerCase(),
    unique: true // Asegura unicidad del nombre
  },
  descripcion: {
    type: String,
    trim: true,
    set: (value) => value.toLowerCase(),
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [0, 'La cantidad no puede ser negativa'],
    validate: {
      validator: function (value) {
        if (this.estado === 'disponible' && value <= 0) {
          return false;
        }
        return true;
      },
      message: 'La cantidad debe ser mayor que 0 cuando el estado es disponible',
    },
  },
  estado: {
    type: String,
    required: [true, 'El estado es obligatorio'],
    enum: ['disponible', 'no disponible'],
    default: 'disponible',
    set: (value) => value.toLowerCase(),
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
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    trim: true,
    set: (value) => value.toLowerCase(),
  },
  horarioDisponibilidad: {
    type: [HorarioSchema],
    default: []
  },
  historialModificaciones: {
    type: [HistorialModificacionesSchema],
    default: []
  }
}, { timestamps: true });

const Implemento = mongoose.model('Implemento', ImplementoSchema);

export default Implemento;
