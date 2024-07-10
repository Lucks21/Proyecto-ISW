import { CRON_SECRET } from "../config/configEnv.js";

const cronAuthMiddleware = (req, res, next) => {
  console.log('CRON_SECRET:', CRON_SECRET);
  console.log('cronSecret header:', req.headers['cron-secret']); 

  const cronSecret = req.headers["cron-secret"];
  if (cronSecret !== CRON_SECRET) {
    return res.status(403).json({ message: "Acceso denegado" });
  }
  next();
};

export default cronAuthMiddleware;
