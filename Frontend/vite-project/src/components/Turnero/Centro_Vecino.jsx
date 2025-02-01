import React, { useEffect, useState } from 'react';
import { centroService } from '../../services/centro.service';
import CentroCastracionCard from './CentroCard';
import alberdiImg from '../../imgs/alberdi.jpg'; 
import lafranceImg from '../../imgs/lafrance.jfif';
import villaImg from '../../imgs/villaall.webp';

const CentrosCastracionList = () => {
  const [centros, setCentros] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await centroService.BuscarTodos();
        if (response.success && Array.isArray(response.result)) {
          setCentros(response.result);
        } else {
          setCentros([]);
        }
      } catch (error) {
        console.error("Error al cargar los centros", error);
        setCentros([]);
      }
    }

    fetchData();
  }, []);

  // Objeto que contiene las imágenes de los centros
  const imagenesCentros = {
    14: alberdiImg,
    15: lafranceImg,
    16: villaImg,
  };

  // Objeto que contiene las rutas de los centros
  const rutasCentros = {
    14: "/tipoAnimal/alberdi",
    15: "/tipoAnimal/lafrance",
    16: "/tipoAnimal/villallende",
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row justify-content-center">
          {Array.isArray(centros) && centros.length > 0 ? (
            centros.map((centro) => (
              <div className="col-md-4 col-sm-6" key={centro.id_centro_castracion}>
                <CentroCastracionCard
                  nombre={centro.nombre}
                  calle={centro.calle}
                  altura={centro.altura}
                  barrio={centro.barrio}
                  horaInicio={formatearHora(centro.horaLaboralInicio)}
                  horaFin={formatearHora(centro.horaLaboralFin)}
                  imagen={imagenesCentros[centro.id_centro_castracion]} // Pasar la imagen correspondiente
                  ruta={rutasCentros[centro.id_centro_castracion]} // Pasar la ruta correspondiente
                />
              </div>
            ))
          ) : (
            <p>No se encontraron centros de castración disponibles.</p>
          )}
        </div>
        <div className="d-flex justify-content-end p-2">
        <button type="button" className="btn btn-dark me-2 confir2">Volver</button>
      </div>
      </div>
      
    </>
  );
};

// Función para formatear la hora
const formatearHora = (hora) => {
  return hora ? hora.substring(0, 5) : "No disponible";
};

export default CentrosCastracionList;
