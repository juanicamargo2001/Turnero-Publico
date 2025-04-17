import axios from "axios";
import loginService from "../login/login.service";

const urlResource = import.meta.env.VITE_SEXO_URL;

async function Buscar() {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const resp = await axios.get(urlResource, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });
    return resp.data;
  } catch (error) {
    console.error("Error al cargar los sexos:", error);
    throw error;
  }
}

export const sexosService = {
  Buscar
};
