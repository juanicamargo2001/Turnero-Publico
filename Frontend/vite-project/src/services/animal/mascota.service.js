import axios from 'axios';
import loginService from "../login/login.service";

const API_URL = import.meta.env.VITE_MASCOTA_URL;

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

      const response = await axios.get(`${API_URL}/misMascotasNoCastradas`, {
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

  async obtenerTodasMisMascotas() {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      // ${API_URL}/misMascotas
      const response = await axios.get(`${API_URL}/misMascotas`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch {
      return null
    }
  },

  async editarMascota(mascota) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      // ${API_URL}/editarAnimal
      const response = await axios.put(`${API_URL}/editarAnimal`, mascota, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.status == 200){
        return response.data
      }else{
        return null
      }
    } catch {
      return null
    }
  },

};

export default mascotaService;
