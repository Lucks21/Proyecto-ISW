import axios from "../services/root.service";

export const getAllImplementos = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/implementos/obtener", {
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

export const partialUpdateImplemento = async (implementoId, data) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const URL = `/implementos/actualizarParcial/${implementoId}`;

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

export const addImplemento = async (implemento) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.post("/implementos/crear", implemento, {
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

export const deleteImplementoById = async (implementoId) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const URL = `/implementos/eliminar/${implementoId}`;

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
