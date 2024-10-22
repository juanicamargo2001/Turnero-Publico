import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import gatoImg from '../../imgs/gato.png'
import perroImg from '../../imgs/perro.png'

const TipoAnimal_Vecino = () => {
  const location = useLocation();
  const navigate = useNavigate();
  let title;
  let confirmPath;

  // Personaliza el título y la ruta de confirmación según la ruta
  switch (location.pathname) {
    case '/tipoAnimal/alberdi':
      title = 'Turnero CDC Alberdi';
      confirmPath = '/registrar/turno/alberdi'; // Ruta de confirmación para Alberdi
      break;
    case '/tipoAnimal/lafrance':
      title = 'Turnero CDC La France';
      confirmPath = '/registrar/turno/lafrance'; // Ruta de confirmación para La France
      break;
    case '/tipoAnimal/villallende':
      title = 'Turnero CDC Villa Allende';
      confirmPath = '/registrar/turno/villaallende'; // Ruta de confirmación para Villa Allende
      break;
  }

  const handleConfirm = () => {
    navigate(confirmPath);
  };

  return (
    
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
