import mongoose from 'mongoose';

const { Schema } = mongoose;

// Definir el esquema de Implementos
const ImplementoSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    unique: true // Asegura unicidad del nombre
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
    default: Date.now,
  },
  categoria: {
    type: String,
    required: true,
    trim: true,
  },
  horarioDisponibilidad: {
    type: [{
      dia: {
        type: String,
        required: true,
        enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']
      },
      inicio: {
        type: String,
        required: true,
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
  historialModificaciones: {
    type: [{
      fecha: {
        type: String,
        required: true,
      },
      cantidadModificada: {
        type: Number,
        required: true,
      },
      nuevoStock: {
        type: Number,
        required: true,
      },
      motivo: {
        type: String,
        required: true,
        trim: true
      }
    }],
    default: []
  }
}, { timestamps: false });

const Implemento = mongoose.model('Implemento', ImplementoSchema);

export default Implemento;
