// backend/src/models/alumno.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const alumnoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  rut: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }] // Referencia al modelo Role
});

// Método para comparar passwords
alumnoSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Middleware para hashear la password antes de guardar
/*alumnoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
}); */

const Alumno = mongoose.model('Alumno', alumnoSchema);
export default Alumno;
