import axios from 'axios';
import loginService from './login.service';

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/Turnos/reservarTurno'; 

const turnosService = {
  async reservarTurno(idHorario) {
    try {
      // Obtener el token de sesión del usuario
      const token = await loginService.obtenerTokenConRenovacion();

      // Realizar la solicitud POST para reservar el turno
      const response = await axios.post(
        API_URL,
        { id_horario_turno: idHorario }, // Solo se envía id_horario_tur
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Autorización con token
          }
        }
      );
      
      // Verificar si la respuesta es exitosa
      if (response.data.success) {
        console.log('Turno reservado con éxito:', response.data.message);
        return response.data; // Devolver los datos de la respuesta
      } else {
        throw new Error(response.data.message); // En caso de error, lanzar una excepción
      }
    } catch (error) {
      console.error('Error al reservar el turno:', error);
      throw error; // Re-lanzar el error para ser manejado en el frontend
    }
  }
};

export { turnosService };
