import axios from "../services/root.service";
import { toast } from 'react-toastify';
export const reservar = async (reserva, item) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const URL = item.cantidad
      ? "/reservas/registrarImplemento"
      : "/reservas/registrarInstalacion";

    const response = await axios.post(URL, reserva, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getReservasActivas = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/reservas/obtenerActivas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getReservasMadeByUser = async (itemType) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const URL =
      itemType === "implemento"
        ? "/reservas/obtenerImplementosByUser"
        : "/reservas/obtenerInstalacionesByUser";

    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getHistorico = async (userId) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get(`/reservas/graficoAlumno/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return data.data;
  } catch (error) {
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getReservasActivasByuserId = async (userId) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get(`/reservas/usuario/${userId}`, {
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

export const cancelarReservaById = async (reservaId) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.post(
      "/reservas/cancelar",
      { reservaId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { status, data } = response;
    return { data: data.data, status };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getReservasGraficoEncargado = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/reservas/grafico", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getReservasNoActivas = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/reservas/historialNoActivas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const getHisorialTodasReservas = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/reservas/historial", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};

export const extenderReserva = async (reservaId, nuevaFechaFin) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.post('/reservas/extender', { reservaId, nuevaFechaFin }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { status, data } = response;
    if (status === 200) {
      toast.success("Reserva extendida con éxito");
      return data;
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response?.data?.message || "Error al extender la reserva");
    return {
      message: error.response?.data?.message,
      error: error.response?.data?.error,
    };
  }
};


export const getImplementosReservados = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/reservas/obtenerImplementos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response?.data?.message || "Error fetching implementos",
      error: error.response?.data?.error,
    };
  }
};

export const getInstalacionesReservadas = async () => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.get("/reservas/obtenerInstalaciones", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;
    return { data: data.data };
  } catch (error) {
    console.log(error);
    return {
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }
};
