"use strict";

/** Modelos de datos */
import User from "../models/user.model.js";
import Alumno from "../models/alumno.model.js";
/** Modulo 'jsonwebtoken' para crear tokens */
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Inicia sesión con un usuario o alumno.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario o alumno
 */
async function login(user) {
  try {
    const { email, password } = user;

    // Buscar en ambos modelos: User y Alumno
    const userFound = await User.findOne({ email: email })
      .populate("roles")
      .exec();
    const alumnoFound = await Alumno.findOne({ correoElectronico: email });

    if (!userFound && !alumnoFound) {
      console.log("Usuario no encontrado");
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    let matchPassword = false;
    let roles = [];

    if (userFound) {
      console.log(`Usuario encontrado: ${JSON.stringify(userFound)}`);
      console.log(`Roles del usuario encontrado: ${userFound.roles.map(role => role.name)}`);
      console.log(`Contraseña del usuario encontrado: ${userFound.password}`);

      matchPassword = await User.comparePassword(password, userFound.password);
      roles = userFound.roles.map(role => role.name);
    } else if (alumnoFound) {
      console.log(`Alumno encontrado: ${JSON.stringify(alumnoFound)}`);
      console.log(`Contraseña del alumno encontrado: ${alumnoFound.contraseña}`);

      matchPassword = await alumnoFound.comparePassword(password);
      roles = ["alumno"];
    }

    if (!matchPassword) {
      console.log("Contraseña incorrecta");
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const accessToken = jwt.sign(
      { email, roles },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = jwt.sign(
      { email },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "7d", // 7 días
      },
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    handleError(error, "auth.service -> login");
    return [null, null, "Error en el servidor"];
  }
}

/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
async function refresh(cookies) {
  try {
    if (!cookies.jwt) return [null, "No hay autorización"];
    const refreshToken = cookies.jwt;

    const accessToken = await jwt.verify(
      refreshToken,
      REFRESH_JWT_SECRET,
      async (err, user) => {
        if (err) return [null, "La sesión ha caducado, vuelva a iniciar sesión"];

        const userFound = await User.findOne({
          email: user.email,
        })
          .populate("roles")
          .exec();
        const alumnoFound = await Alumno.findOne({
          correoElectronico: user.email,
        });

        if (!userFound && !alumnoFound) return [null, "Usuario no autorizado"];

        console.log(`Roles del usuario encontrado: ${userFound ? userFound.roles.map(role => role.name) : "alumno"}`);

        const roles = userFound ? userFound.roles.map(role => role.name) : ["alumno"];

        const newAccessToken = jwt.sign(
          { email: user.email, roles: roles },
          ACCESS_JWT_SECRET,
          {
            expiresIn: "1d",
          },
        );

        return [newAccessToken, null];
      },
    );

    return accessToken;
  } catch (error) {
    handleError(error, "auth.service -> refresh");
    return [null, "Error en el servidor"];
  }
}

export default { login, refresh };
