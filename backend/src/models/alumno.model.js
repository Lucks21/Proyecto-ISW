import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// Función para validar el RUT chileno
const validarRut = (rut) => {
  const rutRegex = /^[0-9]+-[0-9kK]$/;
  return rutRegex.test(rut);
};

// Definir el esquema de Alumno
const alumnoSchema = new Schema(
  {
    rut: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: validarRut,
        message: 'El RUT no es válido'
      }
    },
    contraseña: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    correoElectronico: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return value.endsWith('@alumnos.ubiobio.cl');
        },
        message: 'El correo electrónico debe pertenecer a la universidad (dominio @alumnos.ubiobio.cl).'
      }
    },
    reservasActivas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
    historialReservas: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
  },
  {
    versionKey: false, // Esto es para desactivar la creación del campo '_v' en los documentos
  },
);

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

// Método para comparar contraseñas
alumnoSchema.methods.comparePassword = async function (contraseña) {
  return await bcrypt.compare(contraseña, this.contraseña);
};

const Alumno = mongoose.model("Alumno", alumnoSchema);

export default Alumno;
