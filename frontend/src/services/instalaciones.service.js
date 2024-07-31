import axios from "../services/root.service";

export const getAllInstalaciones = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/instalaciones/obtener", {
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

export const partialUpdateInstalacion = async (instalacionId, data) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const URL = `/instalaciones/actualizarParcial/${instalacionId}`;

    const response = await axios.patch(URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addInstalacion = async (instalacion) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.post("/instalaciones/crear", instalacion, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;

    if (status === 201) {
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

export const deleteInstalacionById = async (instalacionId) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const URL = `/instalaciones/eliminar/${instalacionId}`;

    const response = await axios.delete(URL, {
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
