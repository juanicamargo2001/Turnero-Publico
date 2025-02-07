import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import gatoImg from '../../imgs/gato.png';
import perroImg from '../../imgs/perro.png';
import { mascotasService as turnoTelefonico } from '../../services/turno/turnoTelefonico.service';
import Swal from 'sweetalert2';

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
    Swal.fire({
        title: "Detalles de la Mascota",
        html: `<div style="font-size: 16px; line-height: 1.8;">
               <strong>Nombre:</strong> ${mascota.nombre 
                 ? mascota.nombre.charAt(0).toUpperCase() + mascota.nombre.slice(1).toLowerCase() 
                 : ""}<br>
               <strong>Edad:</strong> ${mascota.edad ?? ""}<br>
               <strong>Sexo:</strong> ${mascota.sexo 
                 ? mascota.sexo.charAt(0).toUpperCase() + mascota.sexo.slice(1).toLowerCase() 
                 : ""}<br>
               <strong>Tamaño:</strong> ${mascota.tamaño 
                 ? mascota.tamaño.charAt(0).toUpperCase() + mascota.tamaño.slice(1).toLowerCase() 
                 : ""}
              </div>`,
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
    });
  
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