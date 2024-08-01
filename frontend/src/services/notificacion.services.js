import axios from 'axios';
const API_URL = 'http://146.83.198.35:1229/api';

export const solicitarNotificacion = async ({recursoId, recursoTipo, userId}) => {
  try {
    const token = localStorage.getItem("accestkn");
    if (!token) return;

    const response = await axios.post(`${API_URL}/notificaciones/solicitar`, {
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
