import axios from "axios";
import loginService from "../login/login.service";


const API_URL = import.meta.env.VITE_CALIFICACION_X_CENTRO;

async function Grabar(calificacion) {
    try {
     const response = await axios.post(`${API_URL}/crearCalificacion`, calificacion, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      });
    if (response.status == 200){
        return true;
    }else{
        return false;
    }
    } catch (error) {
        console.error("Error al grabar la calificacion:", error.response ? error.response.data : error.message);
        return false;
    }
}



async function ObtenerCalificacionPorIdCentro(idCentro) {

    const token = await loginService.obtenerTokenConRenovacion();
        
    try {
     const response = await axios.post(`${API_URL}/calificacionXCentro`, idCentro, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
        },
      });
    if (response.status == 200){
        return response.data;
    }else{
        return null;
    }
    } catch (error) {
        console.error("Error al obtener las calificaciones:", error.response ? error.response.data : error.message);
        return null;
    }
}

export const calificacionService = { Grabar, ObtenerCalificacionPorIdCentro }