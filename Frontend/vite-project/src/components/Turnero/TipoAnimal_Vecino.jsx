import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import gatoImg from '../../imgs/gato.png';
import perroImg from '../../imgs/perro.png';
import mascotaService from '../../services/mascota.service'; // Update with correct path

const TipoAnimal_Vecino = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let title;
  let turneroPath;

  // Personaliza el título y la ruta según el pathname
  switch (location.pathname) {
    case '/tipoAnimal/alberdi':
      title = 'Turnero CDC Alberdi';
      turneroPath = '/registrar/turno/alberdi';
      break;
    case '/tipoAnimal/lafrance':
      title = 'Turnero CDC La France';
      turneroPath = '/registrar/turno/lafrance';
      break;
    case '/tipoAnimal/villallende':
      title = 'Turnero CDC Villa Allende';
      turneroPath = '/registrar/turno/villaallende';
      break;
    default:
      title = 'Selecciona un CDC';
  }

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await mascotaService.obtenerMisMascotas();
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

    // Navega a la ruta correspondiente pasando el tipo de animal y el ID de la mascota en el estado
    navigate(turneroPath, { 
      state: { 
        tipoAnimal: selectedMascota.tipoAnimal,
        idMascota: selectedMascota.idMascota 
      } 
    });
  };

  const handleShowDetails = (mascota) => {
    // You might want to create a modal or navigate to a details page
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
    return <div className="container text-center mt-5">Error al cargar las mascotas</div>;
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
                <h5 className="card-title">{mascota.nombre.toUpperCase()}</h5>
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

export default TipoAnimal_Vecino;