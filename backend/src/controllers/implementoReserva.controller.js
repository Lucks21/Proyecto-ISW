const Implemento = require('../models/implementos.model');
const Reserva = require('../models/reserva.model');
const Notificacion = require('../models/notificacion.model');
const User = require('../models/user.model');
const Notificacion = require('../models/notificacion.model');

exports.registrarReservaImplemento = async (req, res) => {
  try {
    const { implementoId, fechaInicio, fechaFin, userId } = req.body;

    const implemento = await Implemento.findById(implementoId);
    if (!implemento || implemento.estado !== 'disponible' || implemento.cantidad < 1) {
        const notificacion = new Notificacion({ userId: req.userId, recursoId: implemento._id, recursoTipo: 'Implemento' });
        await notificacion.save();
        return respondError(req, res, 400, 'El implemento no está disponible para reservar');
    }

    const reserva = new Reserva({
      userId,
      implementoId,
      fechaInicio,
      fechaFin,
      estado: 'activo'
    });

    await reserva.save();
    await Implemento.findByIdAndUpdate(implementoId, { estado: 'no disponible', cantidad: implemento.cantidad - 1});

    respondSuccess(req, res, 201, 'Reserva de implemento realizada con éxito');
  } catch (error) {
    respondError(req, res, 500, 'Error al realizar la reserva de implemento');
  }
};

exports.cancelarReservaImplemento = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== 'activo') {
      return respondError(res, 400, 'La reserva no está activa o no existe');
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    const implemento = await Implemento.findById(reserva.implementoId);
    implemento.disponible = true;
    implemento.cantidad += 1;
    await implemento.save();

    notificarDisponibilidadImplemento(implemento._id);

    respondSuccess(res, 200, 'Reserva cancelada con éxito');
  } catch (error) {
    respondError(res, 500, 'Error al cancelar la reserva');
  }
};

exports.extenderReservaImplemento = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== 'activo') {
      return respondError(res, 400, 'La reserva no está activa o no existe');
    }

    const implemento = await Implemento.findById(reserva.implementoId);
    if (!implemento || implemento.estado !== 'disponible' || implemento.cantidad < 1) {
        const notificacion = new Notificacion({ userId: req.userId, recursoId: implemento._id, recursoTipo: 'Implemento' });
        await notificacion.save();
        return respondError(res, 400, 'El implemento no está disponible o no hay suficientes en stock');
    }

    implemento.estado = 'no disponible';
    implemento.cantidad -= 1;
    await implemento.save();

    reserva.fechaFin = nuevaFechaFin;
    await reserva.save();

    respondSuccess(res, 200, 'Extensión de reserva realizada con éxito');
  } catch (error) {
    respondError(res, 500, 'Error al extender la reserva');
  }
};

exports.notificarDisponibilidadImplemento = async (implementoId) => {
  try {
    const notificaciones = await Notificacion.find({ recursoId: implementoId, recursoTipo: 'Implemento' });
    for (let notificacion of notificaciones) {
      const user = await User.findById(notificacion.userId);
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: user.email,
        subject: 'El implemento está disponible',
        text: 'El implemento que solicitaste está ahora disponible.'
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      await notificacion.remove();
    }
  } catch (error) {
    console.error('Error al notificar disponibilidad', error);
  }
};

exports.finalizarReservaImplemento = async (req, res) => {
  try {
    const { reservaId } = req.body;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva || reserva.estado !== 'activo') {
      return respondError(res, 400, 'La reserva no está activa o no existe');
    }

    reserva.estado = 'finalizada';
    await reserva.save();

    const implemento = await Implemento.findById(reserva.implementoId);
    implemento.estado = 'disponible';
    implemento.cantidad += 1;
    await implemento.save();

    // Notificar a los usuarios que el implemento está disponible
    notificarDisponibilidadImplemento(implemento._id);

    respondSuccess(res, 200, 'Reserva finalizada con éxito');
  } catch (error) {
    respondError(res, 500, 'Error al finalizar la reserva');
  }
};