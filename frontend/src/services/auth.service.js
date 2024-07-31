import axios from "./root.service";
import cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export const signup = async ({ nombre, rut, email, password }) => {
  try {
    const response = await axios.post("alumnos/crear", {
      nombre,
      rut,
      email,
      password,
    });
    const { status, data } = response;
    if (status === 201) {
      return {
        message: `Se creo el usuario ${data.data.nombre}, inicia sesion...`,
      };
    }
  } catch (error) {
    console.error(error.response.data);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post("auth/login", {
      email,
      password,
    });
    const { status, data } = response;
    if (status === 200) {
      const { email, roles, id } = await jwtDecode(data.data.accessToken);
      localStorage.setItem("user", JSON.stringify({ email, roles, id }));
      localStorage.setItem("accestkn", data.data.accessToken);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.data.accessToken}`;
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accestkn");
  delete axios.defaults.headers.common["Authorization"];
  cookies.remove("jwt");
};

export const test = async () => {
  try {
    const response = await axios.get("/users");
    const { status, data } = response;
    if (status === 200) {
      console.log(data.data);
    }
  } catch (error) {
    console.log(error);
  }
};
