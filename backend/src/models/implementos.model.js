import mongoose from 'mongoose';

const implementosSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  cantidad: Number,
  disponible: Boolean
});

const Implementos = mongoose.model('Implementos', implementosSchema);

export default Implementos;