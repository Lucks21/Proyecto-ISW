"use strict";


import Instalacion from "../models/Instalacion.model.js";
import User from "../models/user.model.js";

async function getInstalaciones() {
  try {
    const instalaciones = await Instalacion.find();
    return [instalaciones, null];
  } catch (error) {
    return [null, "Error al obtener las instalaciones"];
  }
}

async function getInstalacionesPrestadas() {
    try {
      const instalaciones = await Instalacion.find();
      
      const instalacionesPrestadas = instalaciones.filter( instalacion => instalacion.estado === "no disponible") || [];

      return [instalacionesPrestadas, null];
    } catch (error) {
      return [null, "Error al obtener las instalaciones"];
    } 
}

async function getInstalacionById(id) {
  try {
    const instalacion = await Instalacion.findById(id);
    if (!instalacion) {
      return [null, "La instalación no se encontró"];
    }
    return [instalacion, null];
  } catch (error) {
    return [null, "Error al obtener la instalación"];
  }
}

async function createInstalacion(instalacionData) {
  try {
    const existingInstalacion = await Instalacion.findOne({ nombre: instalacionData.nombre });
    if (existingInstalacion) {
      return [null, "La instalación ya existe"];
    }
    const instalacion = new Instalacion(instalacionData);
    const savedInstalacion = await instalacion.save();
    return [savedInstalacion, null];
  } catch (error) {
    return [null, "Error al crear la instalación"];
  }
}

async function updateInstalacion(id, instalacionData) {
  try {
    const updatedInstalacion = await Instalacion.findByIdAndUpdate(id, instalacionData, { new: true });
    if (!updatedInstalacion) {
      return [null, "La instalación no se encontró"];
    }
    return [updatedInstalacion, "Actualización completada con éxito"];
  } catch (error) {
    return [null, "Error al actualizar la instalación"];
  }
}

async function updatedInstalacionDamaged(params, instalacionData) {
  
  //id: implementoId con esto renombras el param "id" a "implementoId", para mayor claridad
  const { id: instalacionId } = params;
  const { damage } = instalacionData;

  
  try {
      
    if(!damage) return { error: "Necesito detalles del daño causado a la instalacion (userId, descripcion, costo)" };

    let instalacion = await Instalacion.findById(instalacionId);
    let user = await User.findById(damage.userId);

    if (!instalacion) return { error: "La instalacion no se encontró" };
    if(!user) return { error: "El usuario no se encontró" };
    

    if (damage) {
      instalacion.damage.descripcion = damage.descripcion;
      instalacion.damage.costo = damage.costo;
      instalacion.damage.userId = user.id;
    }
    
    instalacion.estado = "no disponible y dañada";

    const updatedInstalacion = await instalacion.save();

    return { instalacion: updatedInstalacion, message: `${instalacion.nombre} se actualizo y tiene un estado de: ${instalacion.estado}` };

  } catch (error) {
    return { error: "Error al actualizar la instalacion" };
  }

}

async function deleteInstalacion(id) {
  try {
    const deletedInstalacion = await Instalacion.findByIdAndDelete(id);
    if (!deletedInstalacion) {
      return [null, "La instalación no se encontró"];
    }
    return [deletedInstalacion, null];
  } catch (error) {
    return [null, "Error al eliminar la instalación"];
  }
}

export default {
  getInstalaciones,
  getInstalacionesPrestadas,
  getInstalacionById,
  createInstalacion,
  updateInstalacion,
  updatedInstalacionDamaged,
  deleteInstalacion
};