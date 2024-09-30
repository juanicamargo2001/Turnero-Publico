import axios from 'axios';

const API_URL = 'https://localhost:7245/api/Mascota'; // Asegúrate de que esta URL sea correcta

export const mascotaService = {
  async Grabar(nuevaMascota) {
    try {
      const response = await axios.post(`${API_URL}`, nuevaMascota);
      return response.data;
    } catch (error) {
      console.error("Error al grabar la mascota:", error.response ? error.response.data : error.message);
      throw error; // Propaga el error para manejarlo en el componente
    }
  }
};
