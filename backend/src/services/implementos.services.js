"use strict";

import Implemento from "../models/implementos.model.js";

async function getImplementos() {
  try {
    const implementos = await Implemento.find();
    return [implementos, null];
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

    // Establece la cantidad
    if (implementoData.cantidad !== undefined) {
      implemento.cantidad = Number(implementoData.cantidad);
    }

    // Actualiza el estado en función de la cantidad
    implemento.estado = implemento.cantidad > 0 ? "disponible" : "no disponible";

    implemento.descripcion = implementoData.descripcion || implemento.descripcion;

    const updatedImplemento = await implemento.save();
    return { implemento: updatedImplemento, message: implemento.cantidad > 0 ? `${implemento.nombre} han sido actualizadas y ahora son ${implemento.cantidad} disponibles` : `No hay ${implemento.nombre} disponibles` };
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
  deleteImplemento
};