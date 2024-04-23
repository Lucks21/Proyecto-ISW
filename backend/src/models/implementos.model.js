import mongoose from 'mongoose';

const implementosSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  cantidad: Number,
  estado: {
    type: String,
    enum: ['disponible', 'no disponible'],
    default: 'disponible'
  }
});

const Implementos = mongoose.model('Implementos', implementosSchema);

export default Implementos;
