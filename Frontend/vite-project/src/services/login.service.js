import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_INICIAR_SESION_URL;
const ROL_URL = import.meta.env.VITE_ROL_URL;
const NAME_URL = import.meta.env.VITE_NAME_URL;
const REFRESH_URL = import.meta.env.VITE_REFRESH_URL;
const CHANGEPASS_URL = import.meta.env.VITE_CHANGEPASS_URL;
const RECOVER_URL = import.meta.env.VITE_RECOVER_URL;
const CREAR_SECRETARIA = import.meta.env.VITE_CREAR_SECRETARIA_URL;
const CREAR_ADMIN = import.meta.env.VITE_CREAR_ADMIN_URL;
const CREAR_SUPER_ADMIN = import.meta.env.VITE_CREAR_SUPER_ADMIN_URL;

const login = async (email, clave) => {
  try {
    const response = await axios.post(API_URL, { email, clave });
    const { token, refreshToken } = response.data.result;

    // Guardar tokens en cookies con tiempos de expiración específicos
    Cookies.set('token', token, { expires: 1 / 48 }); // 30 minutos
    Cookies.set('tokenG', token, { expires: 1 });
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
      tokenExpirado: Cookies.get('tokenG'),
      
      refreshToken: refresh
    });
    console.log(Cookies.get('refreshToken'));

    const { token, refreshToken } = response.data.result;
   

    // Guardar los nuevos tokens en cookies
    Cookies.set('token', token, { expires: 1 / 48 }); // 30 minutos
    Cookies.set('tokenG', token, { expires: 1 });
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

const recoverPassword = async (emailRequest) => {
  let token = null;
  try {
    token = await obtenerTokenConRenovacion();
  } catch (error) {
    console.log("Error al obtener token");
    throw error;
  }

  try {
    const response = await axios.put(RECOVER_URL, emailRequest,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
    });
    return response.data.result;
  } catch (error) {
    console.error("Error al enviar el mail:", error.response ? error.response.data : error.message);
    throw error;
  }
}

const crearSecretaria = async (nombre, apellido, contraseña, email, idCentroCastracion) => {
  try {
    const token = await obtenerTokenConRenovacion();
    const body = {
      nombre,
      apellido,
      contraseña,
      email,
      idCentroCastracion
    };

    const response = await axios.post(CREAR_SECRETARIA, body, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear la secretaria:', error);
    throw error;
  }
}

  const crearAdmin = async (nombre, apellido, contraseña, email) => {
    try {
      const token = await obtenerTokenConRenovacion();
      const body = {
        nombre,
        apellido,
        contraseña,
        email
      };
  
      const response = await axios.post(CREAR_ADMIN, body, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear el admin:', error);
      throw error;
    }
};

const crearSuperAdmin = async (nombre, apellido, contraseña, email) => {
  try {
    const token = await obtenerTokenConRenovacion();
    const body = {
      nombre,
      apellido,
      contraseña,
      email
    };

    const response = await axios.post(CREAR_SUPER_ADMIN, body, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el super admin:', error);
    throw error;
  }
};

export default {
  login, obtenerToken,
  obtenerTokenConRenovacion, userRol, userName, changePassword, recoverPassword, crearSecretaria, crearAdmin, crearSuperAdmin
};
