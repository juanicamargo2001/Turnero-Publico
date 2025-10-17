import axios from 'axios';
import loginService from "../login/login.service";

const API_URL = import.meta.env.VITE_VETERINARIO_URL;


async function Grabar(nuevoVeterinario) {

    try {
        const token = await loginService.obtenerTokenConRenovacion();
        const response = await axios.post(API_URL, nuevoVeterinario, {
            headers: {
                'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
        });
        return response.data;
    } catch (error) {
        console.error("Error al grabar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function BuscarTodos() {
    try {
        const token = await loginService.obtenerTokenConRenovacion();
        const response = await axios.get(API_URL, {
            headers: {
                'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function BuscarPorDni(dni) {
    try {
        const token = await loginService.obtenerTokenConRenovacion();
        const response = await axios.get(`${API_URL}/veterinario/${dni}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
        });
        return response.data;
    } catch (error) {
        console.error("Error al buscar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function Modificar(nuevoVeterinario, legajo ) {
    nuevoVeterinario.idLegajo = legajo;
    try {
        const token = await loginService.obtenerTokenConRenovacion();
        const response = await axios.put(API_URL, nuevoVeterinario, {
            headers: {
                'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
              },
        });
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error al modificar el veterinario:", error.response ? error.response.data : error.message);
        throw error;
    }
}

export const veterinarioService = { Grabar, Modificar, BuscarTodos, BuscarPorDni };
