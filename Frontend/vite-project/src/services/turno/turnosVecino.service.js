import axios from 'axios';
import loginService from '../login/login.service';

const urlFiltroPorDni = import.meta.env.VITE_FILTRO_DNI_URL;

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
      return resp.data;
    }
  } catch (error) {
    if (error.response.data.status == 400)
      return "¡No se ha encontrado el DNI!"
  }
}

export const turnosService = {
  filtrarPorDni,
};
