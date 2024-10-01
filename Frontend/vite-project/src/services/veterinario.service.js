import axios from 'axios';

const API_URL = 'https://localhost:7245/api/Veterinario'; // Asegúrate de que esta URL sea correcta

async function Grabar(nuevoVeterinario) {
    try {
        const response = await axios.post(`${API_URL}`, nuevoVeterinario);
        return response.data;
    } catch (error) {
        console.error("Error al grabar el veterinario:", error.response ? error.response.data : error.message);
        throw error; // Propaga el error para manejarlo en el componente
    }
}

/*async function BuscarTodos() {
    try {
        const response = await axios.get(`${API_URL}`);
        return response.data;
    } catch (error) {
        console.error("Error al buscar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}*/

async function Modificar(nuevoVeterinario) {
    try {
        const response = await axios.put(`${API_URL}`, nuevoVeterinario);
        return response.data;
    } catch (error) {
        console.error("Error al modificar el veterinario:", error.response ? error.response.data : error.message);
        throw error; // Propaga el error para manejarlo en el componente
    }
}

export const veterinarioService = {
    Grabar, Modificar
};