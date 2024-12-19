import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Usuario/IniciarSesion';
const ROL_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Usuario/rol';
const NAME_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Usuario/NombreUsuario';
const REFRESH_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Usuario/ObtenerRefreshToken';
const CHANGEPASS_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Usuario/cambiarContraseña'

const login = async (email, clave) => {
  try {
    const response = await axios.post(API_URL, { email, clave });
    const { token, refreshToken } = response.data.result;

    // Guardar tokens en cookies con tiempos de expiración específicos
    Cookies.set('token', token, { expires: 50 / (24 * 60) }); // 50 minutos
    Cookies.set('refreshToken', refreshToken, { expires: 1 }); // 1 día

    return response.data;
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};

// Función para obtener el token desde las cookies
const obtenerToken = () => {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('Token no encontrado'); // Lanza un error si el token no está disponible
  }
  return token; // Retorna el token si existe
};

// Función para refrescar el token utilizando el refreshToken
const refreshToken = async () => {
  const refresh = Cookies.get('refreshToken');
  if (!refresh) {
    throw new Error('Refresh token no encontrado'); // Lanza un error si no hay refreshToken
  }

  try {
    // Enviar solicitud de refresco de token con el refreshToken
    const response = await axios.post(REFRESH_URL, {
      tokenExpirado: obtenerToken(),
      
      refreshToken: refresh
    });
    console.log(Cookies.get('refreshToken'));

    const { token, refreshToken } = response.data.result;

    // Guardar los nuevos tokens en cookies
    Cookies.set('token', token, { expires: 1 / 48 }); // 30 minutos
    Cookies.set('refreshToken', refreshToken, { expires: 1 }); // 1 día

    return token; // Retorna el nuevo token
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    throw error;
  }
};

const obtenerTokenConRenovacion = async () => {
    try {
      let token = obtenerToken();
  
      return token;
    } catch (error) {
      // Si no se encuentra el token o si ha expirado, intenta refrescarlo
      console.log('Token expirado o no encontrado, intentando renovar...');
      return await refreshToken(); // Llama a la función para refrescar el token
    }
};

const userRol = async () => {
  let token = null;
  try {
    token = await obtenerTokenConRenovacion();
  } catch (error) {
    return "default";
  }

  try {
    const response = await axios.get(ROL_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
        'Content-Type': 'application/json',
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error al obtener el rol:", error.response ? error.response.data : error.message);
    return await refreshToken();
    //throw error;
  }
};

const userName = async () => {
  let token = null;
  try {
    token = await obtenerTokenConRenovacion();
  } catch (error) {
    console.log("Error al obtener token");
    throw error;
  }

  try {
    const response = await axios.get(NAME_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error al obtener el nombre de usuario:", error.response ? error.response.data : error.message);
    //return await refreshToken();
    throw error;
  }
};

const changePassword = async (passwordRequest) => {
  let token = null;
  try {
    token = await obtenerTokenConRenovacion();
  } catch (error) {
    console.log("Error al obtener token");
    throw error;
  }

  try {
    const response = await axios.put(CHANGEPASS_URL, passwordRequest,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error.response ? error.response.data : error.message);
    //return await refreshToken();
    throw error;
  }
};

export default {
  login, obtenerToken,
  obtenerTokenConRenovacion, userRol, userName, changePassword,
};
