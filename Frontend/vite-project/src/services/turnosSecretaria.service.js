import axios from "axios";
import loginService from "./login.service";

const API_URL = `https://deep-ghoul-socially.ngrok-free.app/api/Turnos`;

// Obtener turnos por fecha
async function obtenerTurnosPorFecha(fecha) {
    const token = await loginService.obtenerTokenConRenovacion();
    try {
      
      const response = await axios.post(
        `${API_URL}/turnosFiltro`,
        {
          fechaDesde: fecha,
          fechaHasta: fecha,
          horaDesde: "07:00:00",
          horaHasta: "20:00:00",
        },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener turnos por fecha:", error?.response?.data || error.message);
      throw error;
    }
  }

// Obtener turnos por DNI
async function obtenerTurnosPorDni(dni) {
    const token = await loginService.obtenerTokenConRenovacion();
    try {
      
      const response = await axios.post(
        `${API_URL}/filtroPorDni`,
        dni, // Enviar directamente el número
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener turnos por DNI:", error?.response?.data || error.message);
      throw error;
    }
  }

export default {
  obtenerTurnosPorFecha,
  obtenerTurnosPorDni,
};