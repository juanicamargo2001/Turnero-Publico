import axios from "axios";
import loginService from "../login/login.service";

const API_URL = import.meta.env.VITE_AGENDA_URL;

export const agendaService = {
  async Grabar(nuevaAgenda) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();

      const response = await axios.post(`${API_URL}`, nuevaAgenda, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error al registrar la agenda:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  async ConsultarAgendasXCentro(idCentro) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();

      let response = await axios.post(`${API_URL}/AgendaXCentro`, idCentro, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data;
      } else {
        return null;
      }
    } catch (error) {
      console.error(
        "Sucedio un error al consultar las agendas",
        error.response ? error.response.data : error.message
      );
    }
  },

  async EliminarAgenda(idAgenda) {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      console.log(token)

      let response = await axios.delete(`${API_URL}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: { idAgenda }
      });

      if (response.status == 204) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(
        "Sucedio un error al consultar las agendas",
        error.response ? error.response.data : error.message
      );
      return false;
    }
  }
};
