"use strict";


import Instalacion from "../models/Instalacion.model.js";
async function getInstalaciones() {
  try {
    const instalaciones = await Instalacion.find();
    return [instalaciones, null];
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
    return [updatedInstalacion, null];
  } catch (error) {
    return [null, "Error al actualizar la instalación"];
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
  getInstalacionById,
  createInstalacion,
  updateInstalacion,
  deleteInstalacion
};