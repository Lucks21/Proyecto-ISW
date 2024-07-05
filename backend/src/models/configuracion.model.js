import mongoose from 'mongoose';

const { Schema } = mongoose;

// Definir el esquema de Configuración
const ConfiguracionSchema = new Schema({
  diasDeshabilitados: {
    type: [Date],
    required: true,
    default: [],
    //validate: {
      //validator: function (array) {
       // return array.length === new Set(array.map(date => date.toISOString())).size;
      //},
      //message: 'Las fechas deshabilitadas deben ser únicas.'
    //}
  }
}, { timestamps: true });

const Configuracion = mongoose.model('Configuracion', ConfiguracionSchema);

export default Configuracion;
