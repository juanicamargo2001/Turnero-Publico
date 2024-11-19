import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import gatoImg from '../../imgs/gato.png';
import perroImg from '../../imgs/perro.png';

const TipoAnimal_Vecino = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAnimal, setSelectedAnimal] = useState(null);

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

  const handleAnimalSelect = (animal) => {
    setSelectedAnimal(animal);
  };

  const handleConfirm = () => {
    if (!selectedAnimal) {
      alert('Por favor, selecciona un animal.');
      return;
    }

    // Navega a la ruta correspondiente pasando el tipo de animal en el estado
    navigate(turneroPath, { state: { tipoAnimal: selectedAnimal } });
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4 maven-pro-title">{title}</h1>
      <div className="row">
        <div className="col-md-6 mb-4 d-flex justify-content-center">
          <div
            className={`card tipoAnimal text-center ${selectedAnimal === 'GATO' ? 'selected' : ''}`}
            onClick={() => handleAnimalSelect('GATO')}
          >
            <img src={gatoImg} className="card-img-top" alt="gato" />
            <div className="card-body">
              <h5 className="card-title">GATO</h5>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4 d-flex justify-content-center">
          <div
            className={`card tipoAnimal text-center ${selectedAnimal === 'PERRO' ? 'selected' : ''}`}
            onClick={() => handleAnimalSelect('PERRO')}
          >
            <img src={perroImg} className="card-img-top" alt="perro" />
            <div className="card-body">
              <h5 className="card-title">PERRO</h5>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end p-2">
        <button type="button" className="btn btn-dark me-2 confir2" onClick={() => navigate(-1)}>
          Volver
        </button>
        <button type="button" className="btn btn-primary confir" onClick={handleConfirm}>
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default TipoAnimal_Vecino;
