import axios from "axios";
import loginService from "./login.service";

const urlResource = "https://deep-ghoul-socially.ngrok-free.app/api/sexo";

async function Buscar() {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.get(urlResource, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });
    return resp.data; // Asegúrate de que esta línea esté devolviendo la respuesta correctamente
  } catch (error) {
    console.error("Error al cargar los sexos:", error); // Captura cualquier error
    throw error; // Re-lanza el error para manejarlo en el componente
  }
}

export const sexosService = {
  Buscar
};
