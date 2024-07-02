import mongoose from "mongoose";

const { Schema } = mongoose;

// Definir el esquema de Instalaciones
const InstalacionSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      set: (value) => value.toLowerCase(),
    },
    descripcion: {
      type: String,
      trim: true,
      set: (value) => value.toLowerCase(),
    },
    estado: {
      type: String,
      required: [true, "El estado es obligatorio"],
      enum: ["disponible", "no disponible"],
      default: "disponible",
      set: (value) => value.toLowerCase(),
    },
    capacidad: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad debe ser al menos 1"],
    },
    fechaAdquisicion: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          return value <= Date.now();
        },
        message: "La fecha de adquisición no puede ser una fecha futura",
      },
    },
  },
  {
    timestamps: true,  //es necesario? preguntar felipe
    versionKey: false, //esto es para desactivar la crecion del campo '_v' en los documentos
  },
);

const Instalacion = mongoose.model("Instalacion", InstalacionSchema);

export default Instalacion;
