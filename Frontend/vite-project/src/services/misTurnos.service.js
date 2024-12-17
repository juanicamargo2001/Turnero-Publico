import axios from "axios";
import loginService from "./login.service";

const urlResource = "https://deep-ghoul-socially.ngrok-free.app/api/Turnos/misTurnos";
const urlCancelarTurno = "https://deep-ghoul-socially.ngrok-free.app/api/Turnos/cancelarTurno";

async function obtenerMisTurnos() {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const resp = await axios.get(urlResource, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return resp.data.result;
  } catch (error) {
    console.error("Error al cargar los turnos:", error);
    throw error;
  }
}

async function cancelarTurno(idHorario) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const resp = await axios.post(urlCancelarTurno,  idHorario , {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (resp.status === 200) {
      console.log(`Turno con ID ${idHorario} cancelado exitosamente.`);
      return resp.data;
    } else {
      throw new Error("Error al cancelar el turno.");
    }
  } catch (error) {
    console.error("Error al cancelar el turno:", error.response ? error.response.data : error.message);
    throw error;
  }
}

export default { obtenerMisTurnos, cancelarTurno };
