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
                // Crear un mapa para evitar horarios duplicados
                const uniqueHorarios = new Map();

                // Filtrar horarios únicos y extraer tipoTurno sin habilitado
                response.data.result[0].hora.forEach(hora => {
                    const key = `${hora.hora}-${hora.tipoTurno}`;
                    if (!uniqueHorarios.has(key)) {
                        uniqueHorarios.set(key, {
                            idHorario: hora.idHorario,
                            hora: hora.hora,
                            tipoTurno: hora.tipoTurno
                        });
                    }
                });

                // Convertir el mapa a un array y devolver
                return Array.from(uniqueHorarios.values());
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Error al obtener los horarios:", error);
            throw error;
        }
    }
};

export { horarios };
