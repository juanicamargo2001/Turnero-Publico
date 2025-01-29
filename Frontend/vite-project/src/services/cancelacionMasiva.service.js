import axios from "axios";
import loginService from "./login.service";

const urlResource = import.meta.env.VITE_CANCELACION_MASIVA_URL;

async function CancelarMasivamente(requestCancelacionesMasivas) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.post(urlResource, requestCancelacionesMasivas, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    return resp.data; // Asegúrate de que esta línea esté devolviendo la respuesta correctamente
  } catch (error) {
    console.error("Error al cancelar turnos masivamente:", error); // Captura cualquier error
    throw error; // Re-lanza el error para manejarlo en el componente
  }
}

export const turnosService = {
  CancelarMasivamente
};
