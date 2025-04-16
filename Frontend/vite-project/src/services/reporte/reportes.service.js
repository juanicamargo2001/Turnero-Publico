import axios from "axios";
import loginService from "../login/login.service";

const urlResourceTipoAnimal = import.meta.env.VITE_INFORME_TIPO_ANIMAL_URL;
const urlResourceCancelaciones = import.meta.env.VITE_INFORME_CANCELACIONES_URL; // URL del informe de cancelaciones

async function obtenerInformeTipoAnimal(fechaDesde, fechaHasta) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.post(urlResourceTipoAnimal, {fechaDesde, fechaHasta}, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return resp.data;
  } catch (error) {
    console.error("Error al cargar el informe de tipo de animal:", error);
    throw error;
  }
}

async function obtenerInformeCancelaciones(fechaDesde, fechaHasta) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.post(urlResourceCancelaciones, {fechaDesde, fechaHasta}, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return resp.data;  
  } catch (error) {
    console.error("Error al cargar el informe de cancelaciones:", error);
    throw error;
  }
}

export const reportesService = {
  obtenerInformeTipoAnimal,
  obtenerInformeCancelaciones 
};
