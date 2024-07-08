import Configuracion from '../models/configuracion.model.js';

const verificarDiaHabilitado = async (req, res, next) => {
  try {
    const configuracion = await Configuracion.findOne();
    if (configuracion) {
      const hoy = new Date();
      const diaActual = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()); // Ignorar la hora

      const deshabilitado = configuracion.diasDeshabilitados.some(dia => {
        const diaDeshabilitado = new Date(dia);
        return diaDeshabilitado.getTime() === diaActual.getTime();
      });

      if (deshabilitado) {
        return res.status(403).json({ message: 'El sistema no permite arriendos en la fecha actual.' });
      }
    }
    next();
  } catch (error) {
    console.error('Error al verificar la configuración:', error); // Log para detalles del error
    res.status(500).json({ message: 'Error al verificar la configuración.', error });
  }
};

export default verificarDiaHabilitado;
