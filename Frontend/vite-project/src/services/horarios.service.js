import axios from 'axios';

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/turnos';

const horarios = {
    async obtenerHorarios(turnoId, dia) {
        try {
            const response = await axios.post(API_URL, {
                id: turnoId,
                dia: dia
            });
            
            // Verificar si la respuesta es exitosa
            if (response.data.success) {
                // Extraer y devolver solo los horarios habilitados
                return response.data.result[0].hora.map(hora => ({
                    idHorario: hora.idHorario,
                    hora: hora.hora,
                    habilitado: hora.habilitado
                }));
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error al obtener los horarios:", error);
            throw error; // Lanza el error para que se maneje donde se llame
        }
    }
};

export { horarios };
