import mongoose from 'mongoose';

const NotificacionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recursoId: { type: mongoose.Schema.Types.ObjectId, refPath: 'recursoTipo' },
  recursoTipo: { type: String, enum: ['Implemento', 'Instalacion'], required: true }
});

export default mongoose.model('Notificacion', NotificacionSchema);