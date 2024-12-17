import axios from 'axios';
import loginService from './login.service';

const urlFiltroPorDni = 'https://deep-ghoul-socially.ngrok-free.app/api/Turnos/filtroPorDni';

async function filtrarPorDni(dni) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.post(
      urlFiltroPorDni,
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
      console.log(`Turnos filtrados para el DNI ${dni} exitosamente.`);
      return resp.data;
    }
  } catch (error) {
    console.error("Error al filtrar turnos por DNI:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export const turnosService = {
  filtrarPorDni,
};
