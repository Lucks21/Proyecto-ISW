// backend/src/models/alumno.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const alumnoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] // Referencia al modelo Role
});

// Método para comparar contraseñas
alumnoSchema.methods.comparePassword = async function (contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};

// Middleware para hashear la contraseña antes de guardar
alumnoSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.contraseña = await bcrypt.hash(this.contraseña, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const Alumno = mongoose.model('Alumno', alumnoSchema);
export default Alumno;
