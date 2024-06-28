import mongoose from 'mongoose';

const { Schema } = mongoose;

// Definir el esquema de Implementos
const ImplementoSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    set: (value) => value.toLowerCase(),
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
  }
}, { timestamps: true });

// Crear el modelo a partir del esquema
const Implemento = mongoose.model('Implemento', ImplementoSchema);

export default Implemento;

