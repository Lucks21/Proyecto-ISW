// backend/src/middlewares/authorization.middleware.js
"use strict";
// Autorización - Comprobar el rol del usuario
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import Alumno from "../models/alumno.model.js";
/**
 * Comprueba el rol del usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 * @param {String} roleName - Nombre del rol a comprobar
 */
async function checkRole(req, res, next, roleName) {
  try {
    // Imprime el email obtenido del token JWT
    console.log(`Email del usuario (checkRole): ${req.email}`);
    //estoy modificando aqui
    const user = await User.findOne({ email: req.email });
    const alumno = await Alumno.findOne({ email: req.email });

    /*console.log("user",user)
    console.log("alumno",alumno)
    if (alumno!=null) {
      console.log("Entro al if alumno!=null ")
    } else {
      console.log("Hizo el else")
    }
    */

    if (!user && !alumno) {
      console.log(req.email);
      return respondError(req, res, 404, "Usuario no encontrado");
    }
    let roles = [];

    // esto para saber si se encontro en user
    if (user) {
      roles = await Role.find({ _id: { $in: user.roles } });
    }

    // esto para saber si se encontro en alumno
    if (alumno) {
      const rolAlumno = await Role.find({ _id: { $in: alumno.roles } });
      roles = roles.concat(rolAlumno);
    }
    console.log(
      `Roles del usuario (checkRole): ${roles.map((role) => role.name)}`
    );

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === roleName) {
        next();
        return;
      }
    }

    return respondError(
      req,
      res,
      401,
      `Se requiere un rol de ${roleName} para realizar esta acción`
    );
  } catch (error) {
    handleError(error, `authorization.middleware -> checkRole -> ${roleName}`);
  }
}

/**
 * Comprueba si el usuario es administrador
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
function isAdmin(req, res, next) {
  checkRole(req, res, next, "admin");
}

/**
 * Comprueba si el usuario es encargado
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
function isEncargado(req, res, next) {
  checkRole(req, res, next, "encargado");
}

/**
 * Comprueba si el usuario es alumno
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Función para continuar con la siguiente función
 */
function isAlumno(req, res, next) {
  checkRole(req, res, next, "alumno");
}

export { isAdmin, isEncargado, isAlumno };
