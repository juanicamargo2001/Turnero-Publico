import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import gatoImg from '../../imgs/gato.png';
import perroImg from '../../imgs/perro.png';
import { mascotasService as turnoTelefonico } from '../../services/turno/turnoTelefonico.service';


const TipoAnimal_Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { dni, idUsuario } = location.state || {};

  const idParsed = parseInt(idUsuario);
  let title;
  let turneroPath;

  switch (location.pathname) {
    case '/animales/alberdi':
      title = 'Turnero CDC Alberdi';
      turneroPath = '/turno/telefonico/alberdi';
      break;
    case '/animales/lafrance':
      title = 'Turnero CDC La France';
      turneroPath = '/turno/telefonico/lafrance';
      break;
    case '/animales/villallende':
      title = 'Turnero CDC Villa Allende';
      turneroPath = '/turno/telefonico/villaallende';
      break;
    default:
      title = 'Selecciona un CDC';
  }

  useEffect(() => {
    const fetchMascotas = async () => {
      console.log(`ID Usuario: ${idUsuario}`);
    console.log(`DNI: ${idParsed}`);
      try {
        const response = await turnoTelefonico.obtenerMascotasNoCastradas(idParsed);
        console.log("Respuesta de la API:", response);

        if (response.success && response.result) {
          setMascotas(response.result);
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  const handleMascotaSelect = (mascota) => {
    setSelectedMascota(mascota);
  };

  const handleConfirm = () => {
    if (!selectedMascota) {
      alert('Por favor, selecciona una mascota.');
      return;
    }
    navigate(turneroPath, { 
      state: { 
        tipoAnimal: selectedMascota.tipoAnimal,
        idMascota: selectedMascota.idMascota,
        idUsuario: idUsuario
      } 
    });
  };

  const handleShowDetails = (mascota) => {
    alert(`Detalles de la Mascota:
Nombre: ${mascota.nombre}
Edad: ${mascota.edad}
Sexo: ${mascota.sexo}
Tamaño: ${mascota.tamaño}`);
  };

  if (loading) {
    return <div className="container text-center mt-5">Cargando mascotas...</div>;
  }

  if (error) {
    return <div className="container text-center mt-5">No se encontraron mascotas registradas</div>;
  }

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4 maven-pro-title">{title}</h1>
      <div className="row">
        {mascotas.map((mascota) => (
          <div key={mascota.idMascota} className="col-md-6 mb-4 d-flex justify-content-center">
            <div
              className={`card tipoAnimal text-center ${selectedMascota?.idMascota === mascota.idMascota ? 'selected' : ''}`}
              onClick={() => handleMascotaSelect(mascota)}
            >
              <img 
                src={mascota.tipoAnimal === 'GATO' ? gatoImg : perroImg} 
                className="card-img-top" 
                alt={mascota.tipoAnimal.toLowerCase()} 
              />
              <div className="card-body">
              <h5 className="card-title">
                {mascota.nombre ? mascota.nombre.toUpperCase() : "Sin nombre"}
              </h5>
                <button 
                  className="btn btn-info btn-sm mt-2" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowDetails(mascota);
                  }}
                >
                  Detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-end p-2">
        <button type="button" className="btn btn-dark me-2 confir2" onClick={() => navigate(-1)}>
          Volver
        </button>
        <button 
          type="button" 
          className="btn btn-primary confir" 
          onClick={handleConfirm}
          disabled={!selectedMascota}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default TipoAnimal_Admin;