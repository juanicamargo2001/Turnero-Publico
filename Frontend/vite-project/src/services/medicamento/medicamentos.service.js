import axios from 'axios';
import loginService from "../login/login.service";

const API_CREAR_UNIDAD_MEDIDA = import.meta.env.VITE_CREAR_UNIDAD_MEDIDA_URL;
const API_OBTENER_UNIDADES_MEDIDA = import.meta.env.VITE_OBTENER_UNIDAD_MEDIDA_URL;
const API_CREAR_MEDICAMENTO = import.meta.env.VITE_CREAR_MEDICAMENTO_URL;
const API_OBTENER_MEDICAMENTOS = import.meta.env.VITE_OBTENER_MEDICAMENTOS_URL;

const medicamentosService = {
  // Crear una nueva unidad de medida
  crearUnidadMedida: async (unidadMedida) => {
    try {
      const token = await loginService.obtenerTokenConRenovacion();
      const response = await axios.post(API_CREAR_UNIDAD_MEDIDA, unidadMedida, {
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
      const response = await axios.get(API_OBTENER_UNIDADES_MEDIDA, {
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
      const response = await axios.post(API_CREAR_MEDICAMENTO, medicamento, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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
      const token = await loginService.obtenerTokenConRenovacion();
      const response = await axios.get(API_OBTENER_MEDICAMENTOS, {
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
      throw error;
    }
  },
};

export default medicamentosService;
