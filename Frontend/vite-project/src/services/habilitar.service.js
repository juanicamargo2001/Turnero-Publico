import axios from 'axios';

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Agenda'; 

export const agendaService = {
  async Grabar(nuevaAgenda) {
    try {
      const response = await axios.post(`${API_URL}`, nuevaAgenda, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al registrar la agenda:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
};
