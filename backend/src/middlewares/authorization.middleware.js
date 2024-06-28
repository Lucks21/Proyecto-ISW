"use strict";
// Autorización - Comprobar el rol del usuario
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAdmin(req, res, next) {
  try {
    // Imprime el email obtenido del token JWT
    console.log(`Email del usuario (isAdmin): ${req.email}`);
    
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return respondError(req, res, 404, "Usuario no encontrado");
    }

    const roles = await Role.find({ _id: { $in: user.roles } });
    console.log(`Roles del usuario (isAdmin): ${roles.map(role => role.name)}`);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        next();
        return;
      }
    }
    return respondError(req, res, 401, "Se requiere un rol de administrador para realizar esta acción");
  } catch (error) {
    handleError(error, "authorization.middleware -> isAdmin");
  }
}

/**
 * Comprueba si el usuario es encargado
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isEncargado(req, res, next) {
  try {
    // Imprime el email obtenido del token JWT
    console.log(`Email del usuario (isEncargado): ${req.email}`);
    
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return respondError(req, res, 404, "Usuario no encontrado");
    }

    // Imprime los roles del usuario obtenidos de la base de datos
    const roles = await Role.find({ _id: { $in: user.roles } });
    console.log(`Roles del usuario (isEncargado): ${roles.map(role => role.name)}`);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "encargado") {
        next();
        return;
      }
    }

    return respondError(req, res, 401, "Se requiere un rol de encargado para realizar esta acción");
  } catch (error) {
    handleError(error, "authorization.middleware -> isEncargado");
  }
}

/**
 * Comprueba si el usuario es alumno
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
async function isAlumno(req, res, next) {
  try {
    // Imprime el email obtenido del token JWT
    console.log(`Email del usuario (isAlumno): ${req.email}`);
    
    const user = await User.findOne({ email: req.email });
    if (!user) {
      return respondError(req, res, 404, "Usuario no encontrado");
    }

    const roles = await Role.find({ _id: { $in: user.roles } });
    console.log(`Roles del usuario (isAlumno): ${roles.map(role => role.name)}`);

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "alumno") {
        next();
        return;
      }
    }
    return respondError(req, res, 401, "Se requiere un rol de alumno para realizar esta acción");
  } catch (error) {
    handleError(error, "authorization.middleware -> isAlumno");
  }
}

export { isAdmin, isEncargado, isAlumno };
