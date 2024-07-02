"use strict";
import mongoose from "mongoose";

const NotificacionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true, //esto para asegurar que este vinculado a un usuario
  },
  recursoId: { //este es la id del implemento o instalacion
    type: mongoose.Schema.Types.ObjectId,
    refPath: "recursoTipo",
    require: true,
  }, 
  recursoTipo: {
    type: String,
    enum: ["Implemento", "Instalacion"],
    required: true,
  },
});

export default mongoose.model("Notificacion", NotificacionSchema);
