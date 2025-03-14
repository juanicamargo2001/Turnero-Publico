import axios from "axios";
import loginService from "../login/login.service";
import urlServidor from "../../config";

const API_URL = import.meta.env.VITE_CENTRO_CASTRACION_URL;

async function Grabar(nuevoCentro) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();

    const response = await axios.post(`${API_URL}`, nuevoCentro, {
      headers: {
        "ngrok-skip-browser-warning": "true", // Encabezado para omitir la advertencia
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al grabar el centro:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}
async function BuscarTodos() {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        "ngrok-skip-browser-warning": "true", // Encabezado para omitir la advertencia
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al buscar los centros:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function Modificar(nuevoCentro) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const response = await axios.put(`${API_URL}`, nuevoCentro, {
      headers: {
        "ngrok-skip-browser-warning": "true", // Encabezado para omitir la advertencia
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error al modificar el centro:",
      error.response ? error.response.data : error.message
    );
    throw error; // Propaga el error para manejarlo en el componente
  }
}

async function BuscarVetxCentro(idCentro) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const response = await axios.get(
      `${API_URL}/centroXveterinario?idCentro=${idCentro}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true", // Encabezado para omitir la advertencia
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error al buscar los vetrinarios del centro ${idCentro}: `,
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function ObtenerFranjasHorarias(idCentro) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const response = await axios.get(
      `${API_URL}/franjasHorarias/${idCentro}`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch {
    return null;
  }
}

async function CrearFranjaHorarias(franjasHorarias) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const response = await axios.post(
      `${API_URL}/franjasHorarias`,
      franjasHorarias,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data.success) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

async function EliminarFranjaHoraria(franjasHorarias) {
  try {
    const token = await loginService.obtenerTokenConRenovacion();
    const response = await axios.delete(
      `${API_URL}/franjasHorarias`,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: franjasHorarias
      }
    );
    if (response.status == 204) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

async function EditarFranjaHoraria(franjasHorarias) {
  try {
    console.log(franjasHorarias)
    const token = await loginService.obtenerTokenConRenovacion();
    const response = await axios.put(
      `${API_URL}/franjasHorarias`,
      franjasHorarias,
      {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );
    if (response.status == 204) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

export const centroService = {
  Grabar,
  BuscarTodos,
  Modificar,
  BuscarVetxCentro,
  ObtenerFranjasHorarias,
  CrearFranjaHorarias,
  EliminarFranjaHoraria,
  EditarFranjaHoraria
};
