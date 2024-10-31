import axios from "axios";

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/vecino'; // Asegúrate de que esta URL sea correcta

async function Grabar(nuevoVecino) {
    try {
     const response = await axios.post(`${API_URL}`, nuevoVecino, {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
          'Content-Type': 'application/json',
        },
      });
    return response.data;
    } catch (error) {
        console.error("Error al grabar el vecino:", error.response ? error.response.data : error.message);
        throw error; 
    }
}

async function ProcesarImagen(imagen) {
    const data = 'data:' + imagen;
    try {
        const response = await axios.post(`${API_URL}/procesarImagen`, data, {
           headers: {
             'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
             'Content-Type': 'application/json',
           },
         });
       return response.data;
    } catch (error) {
       console.error("Error al procesar imagen:", error.response ? error.response.data : error.message);
       throw error; 
    }
}

/*async function BuscarTodos() {
    try {
        const response = await axios.get(`${API_URL}`, {
            headers: {
              'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.error("Error al buscar los vecinos:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function Modificar(nuevoCentro) {
    try {
        const response = await axios.put(`${API_URL}`, nuevoCentro, {
            headers: {
              'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.error("Error al modificar el centro:", error.response ? error.response.data : error.message);
        throw error; // Propaga el error para manejarlo en el componente
    }
}*/

export const vecinoService={
    Grabar, ProcesarImagen
}