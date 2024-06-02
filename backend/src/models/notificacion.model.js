const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recursoId: { type: mongoose.Schema.Types.ObjectId, refPath: 'recursoTipo' },
  recursoTipo: { type: String, enum: ['Implemento', 'Instalacion'], required: true }
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);