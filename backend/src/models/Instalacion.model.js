import mongoose from 'mongoose';

const instalacionSchema = new mongoose.Schema({
  nombre: String,
  ubicacion: String,
  capacidad: Number,
  disponible: Boolean
});

const Instalacion = mongoose.model('Instalacion', instalacionSchema);

export default Instalacion;