import axios from "../services/root.service";

// Obtener todos los implementos
export const getAllImplementos = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return [];

    const response = await axios.get(`/Implementos/obtener`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;

    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getHistorialImplemento = async (id) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return [];

    const response = await axios.get(`/Implementos/historial/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data || [];
  } catch (error) {
    console.error('Error al obtener el historial del implemento:', error);
    return [];
  }
};

// Añadir un nuevo implemento
export const addImplemento = async (implemento) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return null;

    const response = await axios.post(`/Implementos/crear`, implemento, {
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

    const response = await axios.delete(`/Implementos/eliminar/${id}`, {
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

    const response = await axios.put(`/Implementos/actualizarTodo/${id}`, implemento, {
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

    const response = await axios.patch(`/Implementos/actualizarParcial/${id}`, fields, {
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
