import axios from "axios";
import loginService from "../login/login.service";

const API_URL = import.meta.env.VITE_TURNOS_URL;

async function reservarTurno(idHorario, idMascota) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const requestBody = {
      idTurnoHorario: idHorario,
      idMascota: idMascota,
    };

    const response = await axios.post(`${API_URL}/reservarTurno`, requestBody, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success) {
      console.log("Turno reservado con éxito:", response.data.message);
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error al reservar el turno:", error);
    throw error;
  }
}

async function reservarTurnoUrgencia(nuevoTurnoUrgencia) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const response = await axios.post(
      `${API_URL}/turnoEmergencia`,
      nuevoTurnoUrgencia,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error al reservar el turno de urgencia:", error);
    throw error;
  }
}

async function consultarTurnoToken(token) {
  try {
    const resp = await axios.post(
      `${API_URL}/ObtenerTurnoPorToken`,
      token,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (resp.status === 200) {
      return resp.data;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

async function confirmarTurno(token) {
  try {
    const resp = await axios.post(`${API_URL}/confirmarTurno`, token,  {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status === 200) {
      return resp.data;
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

async function confirmarIngreso(idHorario) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const resp = await axios.post(`${API_URL}/confirmarLlegada`, idHorario, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status === 200) {
      console.log(
        `Turno con ID ${idHorario} confirmado el ingreso exitosamente.`
      );
      return resp.data;
    } else {
      throw new Error("Error al confirmar el ingreso del turno.");
    }
  } catch (error) {
    console.error(
      "Error al confirmar el ingreso del turno:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function finalizarHorario(idHorario) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const resp = await axios.post(`${API_URL}/finalizarTurno`, idHorario, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (resp.status === 200) {
      console.log(`Turno con ID ${idHorario} finalizado exitosamente.`);
      return resp.data;
    } else {
      throw new Error("Error al finalizar el turno.");
    }
  } catch (error) {
    console.error(
      "Error al finalizar el turno:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}



export const turnosService = {
  reservarTurno,
  reservarTurnoUrgencia,
  consultarTurnoToken,
  confirmarTurno,
};
