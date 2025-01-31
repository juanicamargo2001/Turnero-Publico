import axios from "axios";
import loginService from "./login.service";

const urlResourceTipoAnimal = import.meta.env.VITE_INFORME_TIPO_ANIMAL_URL;
const urlResourceCancelaciones = import.meta.env.VITE_INFORME_CANCELACIONES_URL; // URL del informe de cancelaciones

async function obtenerInformeTipoAnimal() {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.get(urlResourceTipoAnimal, {
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

async function obtenerInformeCancelaciones() {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.get(urlResourceCancelaciones, {
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
