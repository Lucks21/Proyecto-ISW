import mongoose from "mongoose";

const { Schema } = mongoose;

const alumnoSchema = new Schema(
  {
    rut: {
      type: String,
      unique: true,
      required: true,
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
    },
    prestamosActivos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
    historialPrestamos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reserva",
      },
    ],
  },
  {
    versionKey: false, //esto es para desactivar la crecion del campo '_v' en los documentos
  },
);

const Alumno = mongoose.model("Alumno", alumnoSchema);

export default Alumno;
