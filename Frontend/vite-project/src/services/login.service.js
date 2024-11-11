import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Usuario/IniciarSesion';

const login = async (email, clave) => {
  try {
    const response = await axios.post(API_URL, { email, clave });
    const { token, refreshToken } = response.data.result;

    // Guardar tokens en cookies con tiempos de expiración específicos
    Cookies.set('token', token, { expires: 1 / 48 }); // 30 minutos = 1/48 de un día
    Cookies.set('refreshToken', refreshToken, { expires: 1 }); // 1 día

    return response.data;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};

export default {
  login,
};
