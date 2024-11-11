import axios from "axios";
import loginService from "./login.service";

const urlResource = "https://deep-ghoul-socially.ngrok-free.app/api/Turnos";

async function Buscar(id) {
  try {
    const token = loginService.obtenerToken();

    const resp = await axios.get(`${urlResource}/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Agrega el token en el encabezado
      },
    });

    // Procesar las fechas para quitar las horas
    const fechasSinHoras = resp.data.result.map(fechaHora => fechaHora.split("T")[0]);

    return fechasSinHoras;
  } catch (error) {
    console.error("Error al cargar los turnos:", error); // Captura cualquier error
    throw error; // Re-lanza el error para manejarlo en el componente
  }
}

export const turnosService = {
  Buscar
};
