import axios from 'axios';

export const solicitarNotificacion = async (recursoId, recursoTipo, userId) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.post("/notificaciones/solicitar", {
      recursoId,
      recursoTipo,
      userId
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response;

    if (status === 200) {
      return data;
    }
  } catch (error) {
    console.log(error);
    return {
      message: error.response?.data?.message || 'Error en la solicitud',
      error: error.response?.data?.error || 'Error desconocido',
    };
  }
};
