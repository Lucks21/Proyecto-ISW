import axios from "../services/root.service"; // Usar el mismo servicio base que `instalaciones.service.js`

const API_URL = 'http://localhost:3200/api'; // Asegúrate de que esta URL sea correcta

// Obtener todos los implementos
export const getAllImplementos = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return [];

    const response = await axios.get(`${API_URL}/Implementos/obtener`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;

    if (status === 200) {
      return data.data; // Asegúrate de que esta sea la estructura correcta
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener implementos:', error);
    return [];
  }
};

// Añadir un nuevo implemento
export const addImplemento = async (implemento) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return null;

    const response = await axios.post(`${API_URL}/Implementos/crear`, implemento, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al agregar implemento:', error);
    throw error;
  }
};

// Eliminar un implemento por ID
export const deleteImplementoById = async (id) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return null;

    const response = await axios.delete(`${API_URL}/Implementos/eliminar/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al eliminar implemento:', error);
    throw error;
  }
};

// Actualizar un implemento por ID
export const updateImplementoById = async (id, implemento) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return null;

    const response = await axios.put(`${API_URL}/Implementos/actualizarTodo/${id}`, implemento, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al actualizar implemento:', error);
    throw error;
  }
};

// Actualizar parcialmente un implemento
export const partialUpdateImplemento = async (id, fields) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return null;

    const response = await axios.patch(`${API_URL}/Implementos/actualizarParcial/${id}`, fields, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al actualizar implemento parcialmente:', error);
    throw error;
  }
};
