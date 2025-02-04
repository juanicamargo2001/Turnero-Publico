import axios from "axios";
import loginService from "../login/login.service";

const API_URL = import.meta.env.VITE_VETERINARIO_X_CENTRO_URL; // Asegúrate de que esta URL sea correcta

async function AsignarCentro(legajo, centro) {
    try {
        const token = await loginService.obtenerTokenConRenovacion();
        const response = await axios.post(`${API_URL}`, {legajo:legajo, centroNombre:centro},{
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

export const veterinarioCentroService={
    AsignarCentro
}