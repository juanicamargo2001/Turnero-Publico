import axios from 'axios';
import loginService from '../login/login.service';

const urlMascotasNoCastradas = import.meta.env.VITE_MASCOTAS_NO_CASTRADAS_URL;
const urlTurnoTelefonico = import.meta.env.VITE_TURNO_TELEFONICO_URL;

async function obtenerMascotasNoCastradas(dni) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.post(
      urlMascotasNoCastradas,
      dni,
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (resp.status === 200) {
      console.log(`Mascotas no castradas obtenidas para el DNI ${dni} exitosamente.`);
      return resp.data;
    } else {
      console.error(`Error al obtener mascotas no castradas: ${resp.status}`);
      throw new Error('Error en la respuesta del servidor.');
    }
  } catch (error) {
    console.error("Error al obtener mascotas no castradas:", error.response ? error.response.data : error.message);
    throw error; 
  }
}

async function crearTurnoTelefonico(idTurnoHorario, idMascota, idUsuario) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.post(
      urlTurnoTelefonico,
      {
        idTurnoHorario,
        idMascota,
        idUsuario,
      },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (resp.status === 200) {
      console.log(`Turno telefónico creado exitosamente: ${JSON.stringify(resp.data)}`);
      return resp.data;
    } else {
      console.error(`Error al crear el turno telefónico: ${resp.status}`);
      throw new Error('Error en la respuesta del servidor.');
    }
  } catch (error) {
    console.error("Error al crear el turno telefónico:", error.response ? error.response.data : error.message);
    throw error; 
  }
}

export const mascotasService = {
  obtenerMascotasNoCastradas,
  crearTurnoTelefonico
};
