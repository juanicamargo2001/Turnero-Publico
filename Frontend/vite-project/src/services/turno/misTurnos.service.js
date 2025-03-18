import axios from "axios";
import loginService from "../login/login.service";

const urlResource = import.meta.env.VITE_MIS_TURNOS_URL;
const urlCancelarTurno = import.meta.env.VITE_CANCELAR_TURNO_URL;
const urlTurnoPostOperatorio = import.meta.env.VITE_TURNO_POST_OPERATORIO_URL;

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

async function obtenerPostOperatorio(idHorario) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const resp = await axios.post(urlTurnoPostOperatorio, idHorario, {
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

export default { obtenerMisTurnos, cancelarTurno, obtenerPostOperatorio };
