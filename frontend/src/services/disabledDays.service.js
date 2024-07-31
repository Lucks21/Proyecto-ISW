import axios from "../services/root.service";

export const createDisabledDay = async (fecha) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.post(
      "/configuraciones/crearDiaDeshabilitado",
      { fecha },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error('Error creating disabled day:', error);
    throw error;
  }
};

export const getDisabledDays = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/configuraciones/obtenerDiaDeshabilitado", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching disabled days:', error);
    throw error;
  }
};

export const deleteDisabledDay = async (fecha) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.delete("/configuraciones/eliminarDiaDeshabilitado", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { fecha },
    });

    return response.data; 
  } catch (error) {
    console.error('Error deleting disabled day:', error);
    throw error;
  }
};
