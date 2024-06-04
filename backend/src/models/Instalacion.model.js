import mongoose from 'mongoose';

const instalacionSchema = new mongoose.Schema({
  nombre: String,
  ubicacion: String,
  capacidad: Number,
  estado: {
    type: String,
    enum: ['disponible', 'no disponible', 'no disponible y dañada'], // los posibles estados
    default: 'disponible' // el estado por defecto
  },
  damage: {
    descripcion: { type: String, required: true } ,
    costo: { type: Number,  required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
});

const Instalacion = mongoose.model('Instalacion', instalacionSchema);

export default Instalacion;