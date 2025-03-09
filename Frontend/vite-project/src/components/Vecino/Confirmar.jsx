import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import { turnosService } from "../../services/turno/turnos.service";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ConfirmarComponent = () => {
  const [turno, setTurno] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("c");
    setIsLoading(true);

    const fetchTurno = async () => {
      let response = await turnosService.consultarTurnoToken(token);
      if (response == null) {
        setIsLoading(false);
      }
      setTurno(response.result);
      setIsLoading(false);
    };

    fetchTurno();
  }, []);

  const formatDate = (date) => {
    let fechaPartes = date.split("-");
    return `${fechaPartes[2]}/${fechaPartes[1]}/${fechaPartes[0]}`;
  };

  const handleConfirm = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("c");

    let response = await turnosService.confirmarTurno(token);

    if (response === null) {
      Swal.fire({
        text: "Sucedio un error al confirmar el turno!",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        text: "El turno se confirmó correctamente",
        icon: "success",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    }
  };

  if (turno == null) {
    return (
      <div className="page-container">
        <h2 className="maven-pro-title text-center mt-4">
          No se encontró el turno!
        </h2>
        {isLoading && (
          <div className="loading-overlay">
            <DotLoader color="#60C1EA" />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="page-container">
        <div className="container mt-5 page-container ">
          <div className="card p-4 ">
            <h2 className="text-center maven-pro-title mb-4">
              Confirmar Turno
            </h2>
            <p>
              Estimado/a, su turno ha sido generado con la siguiente
              información:
            </p>
            <p>
              - Nombre: <strong>{turno?.nombre}</strong>
            </p>
            <p>
              - Centro de Castración: <strong>{turno?.centroCastracion}</strong>
            </p>
            <p>
              - Fecha: <strong>{formatDate(turno?.fecha)}</strong>
            </p>
            <p>
              - Hora: <strong>{turno?.hora.substring(0, 5)}</strong>
            </p>
            <p>¿Desea confirmar este turno?</p>

            <div className="text-center mt-4">
              <button className="btn btn-primary px-4" onClick={handleConfirm}>
                ✅ Confirmar Turno
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default ConfirmarComponent;
