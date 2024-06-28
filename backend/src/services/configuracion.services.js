import Configuracion from '../models/configuracion.model.js';

const convertirAFecha = (fechaStr) => {
  const [dia, mes, anio] = fechaStr.split('-');
  const fecha = new Date(`${anio}-${mes}-${dia}`);
  if (isNaN(fecha.getTime())) {
    throw new Error('Fecha inválida. Use el formato DD-MM-YYYY.');
  }
  return fecha;
};

export const agregarDia = async (fecha) => {
  const fechaDate = convertirAFecha(fecha);

  let configuracion = await Configuracion.findOne();
  if (!configuracion) {
    configuracion = new Configuracion();
  }

  if (configuracion.diasDeshabilitados.some(dia => dia.getTime() === fechaDate.getTime())) {
    throw new Error('La fecha ya está deshabilitada.');
  }

  configuracion.diasDeshabilitados.push(fechaDate);
  await configuracion.save();
  return { message: 'Día deshabilitado agregado.', configuracion };
};

export const eliminarDia = async (fecha) => {
  const fechaDate = convertirAFecha(fecha);

  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw new Error('No se encontraron configuraciones de días deshabilitados.');
  }

  configuracion.diasDeshabilitados = configuracion.diasDeshabilitados.filter(dia => dia.getTime() !== fechaDate.getTime());
  await configuracion.save();
  return { message: 'Día deshabilitado eliminado.', configuracion };
};

export const obtenerDias = async () => {
  const configuracion = await Configuracion.findOne();
  if (!configuracion) {
    throw new Error('No se encontraron configuraciones de días deshabilitados.');
  }
  return configuracion.diasDeshabilitados;
};
