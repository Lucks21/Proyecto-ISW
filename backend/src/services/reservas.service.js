import Reservas from '../models/reservas.model.js'

async function getAllReservasByUser(id) { //Visualizar las reservas por IDusuario
    
    try {
        
        const reservas = await Reservas.find();        

        const reservasByUserId = reservas.filter( reserva => reserva.userId.toString() === id) || [];
                
        return [reservasByUserId, null];
        
      } catch (error) {
        return [null, "Error al obtener las reservas"];
      }
    
}

async function getAllReservasActivos() {//Visualizar las reservas activas
    
    try {
        
        const reservas = await Reservas.find();
        
        const reservasActivos = reservas.filter( reserva => reserva.estado === 'activo') || [];
                
        return [reservasActivos, null];
        
      } catch (error) {
        return [null, "Error al obtener las reservas"];
      }
}

 
export default {
    getAllReservasByUser,
    getAllReservasActivos
};