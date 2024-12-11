import axios from 'axios';
import loginService from "./login.service";

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/mascota';

const mascotaService = {
  async grabar(nuevaMascota) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();

      const response = await axios.post(API_URL, nuevaMascota, {
        headers: {
          'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al grabar la mascota:", error.response ? error.response.data : error.message);
      throw error; // Propaga el error para manejarlo en el componente
    }
  },

  async obtenerMisMascotas() {
    try {
      const token = await loginService.obtenerTokenConRenovacion();

      const response = await axios.get(`${API_URL}/misMascotas`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener las mascotas:", error.response ? error.response.data : error.message);
      throw error; // Propaga el error para manejarlo en el componente
    }
  },
};

export default mascotaService;
