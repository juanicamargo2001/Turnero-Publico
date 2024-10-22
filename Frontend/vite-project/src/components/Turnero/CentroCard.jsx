import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Importa el componente Link

const CentroCastracionCard = ({ nombre, calle, altura, barrio, horaInicio, horaFin, imagen, ruta }) => {
  return (
    <div className="card turno mb-3 maven-pro-body m-4" style={{ width: '21.75rem'}}>
      <img 
        src={imagen} 
        alt={`Centro ${nombre}`} 
        className="card-img-top"
      />
      <div className="card-body turno">
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text">{`${calle} ${altura}, Barrio ${barrio}`}</p>
        <p className="card-text">{`Horario de atención: ${horaInicio} - ${horaFin}`}</p>
        <div className='obtn'>
          <Link to={ruta} className="btn btn-primary obtenerTurno">Obtener Turno</Link> {/* Usar Link para la navegación */}
        </div>
      </div>
    </div>
  );
};

export default CentroCastracionCard;
