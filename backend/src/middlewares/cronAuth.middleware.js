import { CRON_SECRET } from "../config/configEnv.js";

const cronAuthMiddleware = (req, res, next) => {
  const cronSecret = req.headers["cron-secret"];
  if (cronSecret !== CRON_SECRET) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};

export default cronAuthMiddleware;
