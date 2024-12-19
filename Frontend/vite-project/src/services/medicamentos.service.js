import axios from 'axios';
import loginService from "./login.service";

const API_BASE_URL = 'https://deep-ghoul-socially.ngrok-free.app/api';

const medicamentosService = {
  // Crear una nueva unidad de medida
  crearUnidadMedida: async (unidadMedida) => {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const response = await axios.post(`${API_BASE_URL}/UnidadMedida/crearUnidadMedida`, unidadMedida, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear la unidad de medida:', error);
      throw error;
    }
  },

  // Obtener todas las unidades de medida
  obtenerUnidadesMedida: async () => {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const response = await axios.get(`${API_BASE_URL}/UnidadMedida/obtenerUnidadesMedida`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener las unidades de medida:', error);
      throw error;
    }
  },

  // Crear un nuevo medicamento
  crearMedicamento: async (medicamento) => {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const response = await axios.post(`${API_BASE_URL}/Medicamento/crearMedicamento`, medicamento, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear el medicamento:', error);
      loginService.refreshToken();
      throw error;
    }
  },

  // Obtener todos los medicamentos
  obtenerMedicamentos: async () => {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const response = await axios.get(`${API_BASE_URL}/Medicamento/obtenerMedicamentos`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los medicamentos:', error);
      loginService.refreshToken();
      throw error;
    }
  },
};

export default medicamentosService;
