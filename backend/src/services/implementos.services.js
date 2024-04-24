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

async function createOrUpdateImplemento(implementoData) {
  try {
    let implemento = await Implemento.findOne({ nombre: implementoData.nombre });

    if (implemento) {
      // Si el implemento ya existe, aumenta el stock
      implemento.cantidad += implementoData.cantidad;
    } else {
      // Si el implemento es nuevo, crea una nueva entrada
      implemento = new Implemento(implementoData);
    }

    const savedImplemento = await implemento.save();
    return [savedImplemento, null];
  } catch (error) {
    return [null, "Error al crear o actualizar el implemento"];
  }
}

async function updateImplemento(id, implementoData) {
  try {
    const updatedImplemento = await Implemento.findByIdAndUpdate(id, implementoData, { new: true });
    if (!updatedImplemento) {
      return [null, "El implemento no se encontró"];
    }
    return [updatedImplemento, null];
  } catch (error) {
    return [null, "Error al actualizar el implemento"];
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
  createOrUpdateImplemento,
  updateImplemento,
  deleteImplemento
};