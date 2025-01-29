import axios from "axios";
import loginService from "./login.service";

const urlResource = import.meta.env.VITE_OBTENER_TURNOS_ANIMAL_URL;

async function Buscar(idCentroCastracion, tipoAnimal) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.post(
      urlResource,
      {
        idCentroCastracion,
        tipoAnimal,
      },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Agrega el token en el encabezado
        },
      }
    );

    // Procesar las fechas para quitar las horas
    const fechasSinHoras = resp.data.result.map(fechaHora => fechaHora.split("T")[0]);

    return fechasSinHoras;
  } catch (error) {
    console.error("Error al cargar los turnos:", error); // Captura cualquier error
    throw error; // Re-lanza el error para manejarlo en el componente
  }
}

export const turneroService = {
  Buscar
};
