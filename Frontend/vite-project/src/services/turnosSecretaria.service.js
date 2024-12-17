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
          horaDesde: "01:00:00",
          horaHasta: "23:00:00",
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

  async function confirmarTurno(idHorario) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const resp = await axios.post(`${API_URL}/confirmarTurno`,  idHorario , {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (resp.status === 200) {
        console.log(`Turno con ID ${idHorario} confirmado exitosamente.`);
        return resp.data;
      } else {
        throw new Error("Error al confirmar el turno.");
      }
    } catch (error) {
      console.error("Error al confirmar el turno:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
  
  async function confirmarIngreso(idHorario) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const resp = await axios.post(`${API_URL}/confirmarLlegada`,  idHorario , {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (resp.status === 200) {
        console.log(`Turno con ID ${idHorario} confirmado el ingreso exitosamente.`);
        return resp.data;
      } else {
        throw new Error("Error al confirmar el ingreso del turno.");
      }
    } catch (error) {
      console.error("Error al confirmar el ingreso del turno:", error.response ? error.response.data : error.message);
      throw error;
    }
  }
  
  async function finalizarHorario(idHorario) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const resp = await axios.post(`${API_URL}/finalizarTurno`,  idHorario , {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (resp.status === 200) {
        console.log(`Turno con ID ${idHorario} finalizado exitosamente.`);
        return resp.data;
      } else {
        throw new Error("Error al finalizar el turno.");
      }
    } catch (error) {
      console.error("Error al finalizar el turno:", error.response ? error.response.data : error.message);
      throw error;
    }
  }

export default {
  obtenerTurnosPorFecha,
  obtenerTurnosPorDni,
  confirmarTurno,
  confirmarIngreso,
  finalizarHorario
};