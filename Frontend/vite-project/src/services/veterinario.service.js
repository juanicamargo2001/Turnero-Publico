import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/veterinario';

// Helper para obtener el token desde las cookies
function getAuthHeaders() {
    const token = Cookies.get('token'); // Asegúrate de que el token esté guardado en la cookie "token"
    return {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

async function Grabar(nuevoVeterinario) {
    try {
        const response = await axios.post(API_URL, nuevoVeterinario, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error al grabar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function BuscarTodos() {
    try {
        const response = await axios.get(API_URL, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function BuscarPorDni(dni) {
    try {
        const response = await axios.get(`${API_URL}/${dni}`, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function Modificar(nuevoVeterinario) {
    try {
        const response = await axios.put(API_URL, nuevoVeterinario, {
            headers: getAuthHeaders(),
        });
        return response.data;
    } catch (error) {
        console.error("Error al modificar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const veterinarioService = { Grabar, Modificar, BuscarTodos, BuscarPorDni };
