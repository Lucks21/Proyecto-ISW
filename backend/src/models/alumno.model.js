import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const alumnoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,// esto es para eliminar los espacios en blanco al principio y al final
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [50, 'El nombre no puede exceder los 50 caracteres']
  },
  rut: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: [9, 'La contraseña debe tener al menos 9 caracteres']
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }] // Referencia al modelo Role
},
{
  timestamps: false,
  versionKey: false, // esto es para desactivar la creción del campo '_v' en los documentos
},
);

// Método para comparar passwords
alumnoSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Alumno = mongoose.model('Alumno', alumnoSchema);
export default Alumno;
