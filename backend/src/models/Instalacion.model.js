import mongoose from 'mongoose';

const instalacionSchema = new mongoose.Schema({
  nombre: String,
  ubicacion: String,
  capacidad: Number,
  estado: {
    type: String,
    enum: ['disponible', 'no disponible'], // los posibles estados
    default: 'disponible' // el estado por defecto
  }
});

const Instalacion = mongoose.model('Instalacion', instalacionSchema);

export default Instalacion;