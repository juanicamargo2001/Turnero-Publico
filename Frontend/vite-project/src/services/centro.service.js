import axios from "axios";
import loginService from "./login.service";

const API_URL = 'https://deep-ghoul-socially.ngrok-free.app/api/centroCastracion'; // Asegúrate de que esta URL sea correcta

async function Grabar(nuevoCentro) {
    try {
      const token = loginService.obtenerToken();

     const response = await axios.post(`${API_URL}`, nuevoCentro,{
        headers: {
          'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });
    return response.data;
    } catch (error) {
    console.error("Error al grabar el centro:", error.response ? error.response.data : error.message);
    throw error; 
    }
}
async function BuscarTodos() {
    try {
        const response = await axios.get(`${API_URL}`, {
            headers: {
              'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
              'Content-Type': 'application/json',
            },
          });
        return response.data;
    } catch (error) {
        console.error("Error al buscar los centros:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function Modificar(nuevoCentro) {
    try {
        const token = loginService.obtenerToken(); 
        const response = await axios.put(`${API_URL}`, nuevoCentro, {
            headers: {
              'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
          });
        return response.data;
    } catch (error) {
        console.error("Error al modificar el centro:", error.response ? error.response.data : error.message);
        throw error; // Propaga el error para manejarlo en el componente
    }
}

async function BuscarVetxCentro(idCentro){
  try {
    const token = loginService.obtenerToken();
    const response = await axios.get(`${API_URL}/centroXveterinario?idCentro=${idCentro}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Encabezado para omitir la advertencia
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
    });
   return response.data
  } catch (error) {
    console.error(`Error al buscar los vetrinarios del centro ${idCentro}: `, error.response ? error.response.data : error.message);
    throw error;
  }
}

export const centroService={
    Grabar, BuscarTodos, Modificar, BuscarVetxCentro
}