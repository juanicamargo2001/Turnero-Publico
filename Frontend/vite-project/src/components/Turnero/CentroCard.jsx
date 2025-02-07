import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; 

const CentroCastracionCard = ({ nombre, calle, altura, barrio, horaInicio, horaFin, imagen, ruta, idUsuario, dni }) => {
  return (
    <div className="card turno mb-3 maven-pro-body">
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
        <Link
            to={ruta}
            className="btn btn-primary obtenerTurno"
            state={{ idUsuario, dni }} 
          >
            Obtener Turno
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CentroCastracionCard;
