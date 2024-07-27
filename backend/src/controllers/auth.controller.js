"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "../config/configEnv.js";

/** Servicios de autenticación */
import AuthService from "../services/auth.service.js";
import { authLoginBodySchema } from "../schema/auth.schema.js";

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function login(req, res) {
  try {
    const { body } = req; 
    /**{
     * email: "admin@example"  |  "ecargado@mail.com" | "matias.pereira2001@alumnos.ubiobio.cl"
     * password: "$12387aseua" | "Mypassword1234" | "contraseña1234"
     * }
    */
    const { error: bodyError } = authLoginBodySchema.validate(body);
    if (bodyError) return respondError(req, res, 400, bodyError.message);

    const [accessToken, refreshToken, errorToken] =
      await AuthService.login(body);

    if (errorToken) return respondError(req, res, 400, errorToken);

    // * Existen mas opciones de seguirdad para las cookies *//
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    respondSuccess(req, res, 200, { accessToken });
  } catch (error) {
    handleError(error, "auth.controller -> login");
    respondError(req, res, 400, error.message);
  }
}

/**
 * @name logout
 * @description Cierra la sesión del usuario
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns
 */
async function logout(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");
    res.clearCookie("jwt", { httpOnly: true });
    respondSuccess(req, res, 200, { message: "Sesión cerrada correctamente" });
  } catch (error) {
    handleError(error, "auth.controller -> logout");
    respondError(req, res, 400, error.message);
  }
}

/**
 * @name refresh
 * @description Refresca el token de acceso
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
async function refresh(req, res) {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return respondError(req, res, 400, "No hay token");

    const [accessToken, errorToken] = await AuthService.refresh(cookies);

    if (errorToken) return respondError(req, res, 400, errorToken);

    respondSuccess(req, res, 200, { accessToken });
  } catch (error) {
    handleError(error, "auth.controller -> refresh");
    respondError(req, res, 400, error.message);
  }
}

/**
 * Verifica el token JWT para comprobar su contenido.
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 */
function verificarToken(req, res) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return respondError(req, res, 401, "No autorizado", "No hay token válido");
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, ACCESS_JWT_SECRET);
    return respondSuccess(req, res, 200, "Token válido", decoded);
  } catch (error) {
    return respondError(req, res, 403, "No autorizado", "Token inválido", error.message);
  }
}

export default {
  login,
  logout,
  refresh,
  verificarToken,
};
