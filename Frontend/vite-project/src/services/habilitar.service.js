import axios from 'axios';
import loginService from "./login.service";

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Agenda'; 

export const agendaService = {
  async Grabar(nuevaAgenda) {
    try {
      const token = loginService.obtenerToken();

      const response = await axios.post(`${API_URL}`, nuevaAgenda, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al registrar la agenda:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
};
