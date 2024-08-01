import axios from "../services/root.service"; 

const API_URL = 'http://146.83.198.35:1229/api';

export const getAllImplementos = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return [];

    const response = await axios.get(`${API_URL}/Implementos/obtener`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data.data; 
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error al obtener implementos:', error);
    return [];
  }
};

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

export const partialUpdateImplemento = async (id, updatedFields) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return null;

    const response = await axios.patch(`${API_URL}/Implementos/actualizarParcial/${id}`, updatedFields, {
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
