import Prestamos from '../models/prestamo.model.js'

async function getAllPrestamosByUser(id) {
    
    try {
        
        const prestamos = await Prestamos.find();        

        const prestamosByUserId = prestamos.filter( prestamo => prestamo.userId.toString() === id) || [];
                
        return [prestamosByUserId, null];
        
      } catch (error) {
        return [null, "Error al obtener los prestamos"];
      }
    
}

async function getAllPrestamosActivos() {
    
    try {
        
        const prestamos = await Prestamos.find();
        
        const prestamosActivos = prestamos.filter( prestamo => prestamo.estado === 'activo') || [];
                
        return [prestamosActivos, null];
        
      } catch (error) {
        return [null, "Error al obtener los prestamos"];
      }
}


export default {
    getAllPrestamosByUser,
    getAllPrestamosActivos
};