"use strict";

/** Modelo de datos 'User' */
import User from "../models/user.model.js";
import Alumno from "../models/alumno.model.js";
/** Modulo 'jsonwebtoken' para crear tokens */
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";
import { handleError } from "../utils/errorHandler.js";

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario
 */
async function login(user) {
  try {
    const { email, password } = user;

    let userFound;

    if (email.includes("@alumnos.ubiobio.cl")) {
      userFound = await Alumno.findOne({ email: email })
        .populate("roles")
        .exec();      
    } else {
      userFound = await User.findOne({ email: email })
        .populate("roles")
        .exec();
    }

    if (!userFound) {
      return [null, null, "usuario"];
    }

    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, null, "password"];
    }

    // Añadir log para verificar los roles obtenidos
    console.log(`Roles del usuario encontrado: ${userFound.roles}`);

    // Obtener los nombres de los roles
    const roles = userFound.roles.map(role => role.name);

    // Verifica que userFound._id esté presente
    console.log(`ID del usuario encontrado: ${userFound._id}`);

    const accessToken = jwt.sign(
      { id: userFound._id.toString(), email: userFound.email, roles: roles },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    const refreshToken = jwt.sign(
      { id: userFound._id.toString(), email: userFound.email },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "7d", // 7 días
      },
    );

    return [accessToken, refreshToken, null];
  } catch (error) {
    console.log({ error });
    handleError(error, "auth.service -> signIn");
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

        if (!userFound) return [null, "Usuario no autorizado"];

        // Añadir log para verificar los roles obtenidos
        console.log(`Roles del usuario encontrado: ${userFound.roles}`);

        // Obtener los nombres de los roles
        const roles = userFound.roles.map(role => role.name);

        const newAccessToken = jwt.sign(
          { id: userFound._id.toString(), email: userFound.email, roles: roles },
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
