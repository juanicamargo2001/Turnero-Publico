import axios from "axios";

const urlResource = "https://localhost:7245/api/Sexo";

async function Buscar() {
  try {
    const resp = await axios.get(urlResource);
    return resp.data; // Asegúrate de que esta línea esté devolviendo la respuesta correctamente
  } catch (error) {
    console.error("Error al cargar los sexos:", error); // Captura cualquier error
    throw error; // Re-lanza el error para manejarlo en el componente
  }
}

export const sexosService = {
  Buscar
};
