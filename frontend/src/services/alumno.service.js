import axios from "../services/root.service";

export const getAllAlumnos = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/alumnos/obtener/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;

    if (status === 204) return { data: [] };

    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const deleteAlumnoById = async (alumnoId) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const URL = `/alumnos/eliminar/${alumnoId}`;
    console.log(URL);

    const response = await axios.delete(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;

    return data;
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};
