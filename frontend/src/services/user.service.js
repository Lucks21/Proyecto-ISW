import axios from "./root.service";

export const getUserByEmail = async (email) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get(`alumnos/obtenerByEmail/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { status, data } = response;

    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.error(error.response.data);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const updateUserById = async (id, newDataUser) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.put(`alumnos/actualizar/${id}`, newDataUser, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;

    if (status === 200) {
      return data.data;
    }
  } catch (error) {
    console.error(error.response.data);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};
