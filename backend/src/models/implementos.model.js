import mongoose from "mongoose";

const implementosSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  cantidad: Number,
  estado: {
    type: String,
    enum: ["disponible", "no disponible", "no disponible y dañado"],
    default: "disponible",
  },
  damage: {
    descripcion: { type: String, required: true } ,
    costo: { type: Number,  required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
  },
});

const Implementos = mongoose.model("Implementos", implementosSchema);

export default Implementos;
