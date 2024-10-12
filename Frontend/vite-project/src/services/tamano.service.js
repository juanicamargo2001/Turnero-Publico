import axios from "axios";
const urlResource = "https://deep-ghoul-socially.ngrok-free.app/api/tamaño";
async function Buscar() {
  try {
    const resp = await axios.get(urlResource, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
        'Content-Type': 'application/json',
      },
    });
    return resp.data; // Asegúrate de que esta línea esté devolviendo la respuesta correctamente
  } catch (error) {
    console.error("Error al cargar los tamaños:", error); // Captura cualquier error
    throw error; // Re-lanza el error para manejarlo en el componente
  }
}
export const tamanoService = {
  Buscar
};
