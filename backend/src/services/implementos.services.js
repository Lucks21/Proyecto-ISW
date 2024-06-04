"use strict";

import Implemento from "../models/implementos.model.js";
import User from "../models/user.model.js";

async function getImplementos() {
  try {
    const implementos = await Implemento.find();
    return [implementos, null];
  } catch (error) {
    return [null, "Error al obtener los implementos"];
  }
}

async function getImplementosPrestados() {
  try {
    const implementos = await Implemento.find();

    const implementosPrestados = implementos.filter( implemento => implemento.estado === "no disponible") || [];

    return [implementosPrestados, null];

  } catch (error) {
    return [null, "Error al obtener los implementos"];
  }
}

async function getImplementoById(id) {
  try {
    const implemento = await Implemento.findById(id);
    if (!implemento) {
      return [null, "El implemento no se encontró"];
    }
    return [implemento, null];
  } catch (error) {
    return [null, "Error al obtener el implemento"];
  }
}

async function createImplemento(implementoData) {
  try {
    // Crea una nueva entrada
    let implemento = new Implemento(implementoData);

    const savedImplemento = await implemento.save();
    return [savedImplemento, null];
  } catch (error) {
    return [null, "Error al crear el implemento"];
  }
}

async function updateImplemento(id, implementoData) {
  try {
    let implemento = await Implemento.findById(id);

    if (!implemento) {
      return { error: "El implemento no se encontró" };
    }

    // Actualiza el nombre si se proporciona uno nuevo
    if (implementoData.nombre) {
      implemento.nombre = implementoData.nombre;
    }

    // Incrementa la cantidad
    if (implementoData.cantidad) {
      implemento.cantidad += implementoData.cantidad;
    }

    implemento.estado = implementoData.estado || implemento.estado;
    implemento.descripcion = implementoData.descripcion || implemento.descripcion;

    const updatedImplemento = await implemento.save();
    return { implemento: updatedImplemento, message: `${implemento.nombre} han sido actualizadas y ahora son ${implemento.cantidad} disponibles` };
  } catch (error) {
    return { error: "Error al actualizar el implemento" };
  }
}

async function updatedImplementoDamaged(params, implementoData) {
    
    //id: implementoId con esto renombras el param "id" a "implementoId", para mayor claridad
    const { id: implementoId } = params;
    const { damage } = implementoData;

    try {
      
      if(!damage) return { error: "Necesito detalles del daño causado al implemento (userId, descripcion, costo)" };

      let implemento = await Implemento.findById(implementoId);
      let user = await User.findById(damage.userId);

      if (!implemento) return { error: "El implemento no se encontró" };
      if(!user) return { error: "El usuario no se encontró" };
      

      if (damage) {
        implemento.damage.descripcion = damage.descripcion;
        implemento.damage.costo = damage.costo;
        implemento.damage.userId = user.id;
      }
      
      implemento.estado = "no disponible y dañado";

      const updatedImplemento = await implemento.save();

      return { implemento: updatedImplemento, message: `${implemento.nombre} se actualizo y tiene un estado de: ${implemento.estado}` };

    } catch (error) {
      return { error: "Error al actualizar el implemento" };
    }
    
}

async function deleteImplemento(id) {
  try {
    const deletedImplemento = await Implemento.findByIdAndDelete(id);
    if (!deletedImplemento) {
      return [null, "El implemento no se encontró"];
    }
    return [deletedImplemento, null];
  } catch (error) {
    return [null, "Error al eliminar el implemento"];
  }
}

export default {
  getImplementos,
  getImplementoById,
  createImplemento,
  updateImplemento,
  updatedImplementoDamaged,
  deleteImplemento,
  getImplementosPrestados
};