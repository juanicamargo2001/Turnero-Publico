import axios from 'axios';

const API_BASE_URL = 'https://deep-ghoul-socially.ngrok-free.app/api';

const medicamentosService = {
  // Crear una nueva unidad de medida
  crearUnidadMedida: async (unidadMedida) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/UnidadMedida/crearUnidadMedida`, unidadMedida, {
        headers: {
          'Content-Type': 'application/json',
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
      const response = await axios.get(`${API_BASE_URL}/UnidadMedida/obtenerUnidadesMedida`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener las unidades de medida:', error);
      throw error;
    }
  },

  // Crear un nuevo medicamento
  crearMedicamento: async (medicamento) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Medicamento/crearMedicamento`, medicamento, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear el medicamento:', error);
      throw error;
    }
  },

  // Obtener todos los medicamentos
  obtenerMedicamentos: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Medicamento/obtenerMedicamentos`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los medicamentos:', error);
      throw error;
    }
  },
};

export default medicamentosService;
