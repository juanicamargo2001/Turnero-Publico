import { useEffect, useState } from "react";
import misTurnosService from "../services/turno/misTurnos.service";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { DotLoader } from "react-spinners";

function TurnoVecino() {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [postOperatorio, setPostOperatorio] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTurnos = async () => {
      setIsLoading(true);
      try {
        const data = await misTurnosService.obtenerMisTurnos();
        console.log(data)
        setTurnos(Array.isArray(data) ? data : [data]);
        setIsLoading(false);
      } catch {
        setError("Error al cargar los turnos");
      }      
    };

    fetchTurnos();
}, []);

  const handleCancelarTurno = async (idHorario, idUsuario) => {
    const parsedId = parseInt(idHorario);

    if (isNaN(parsedId)) {
      setCancelError("El ID del turno no es válido.");
      return;
    }

    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Este cambio no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cancelar Turno",
      cancelButtonText: "Volver",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn-danger", // Botón "Cancelar" (confirmación)
        cancelButton: "btn-secondary", // Botón "Volver" (cancelación)
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la cancelación
        try {
          // Cancelar el turno en el backend
          await misTurnosService.cancelarTurno(parsedId, idUsuario);
          setCancelError(null);
          console.log(`Turno con ID ${parsedId} cancelado exitosamente.`);

          // Mostrar un mensaje de éxito
          Swal.fire(
            "Cancelado",
            `El turno ha sido cancelado correctamente.`,
            "success"
          );

          // Eliminar el turno de la lista localmente
          setTurnos((prevTurnos) =>
            prevTurnos.filter((turno) => turno.idHorario !== parsedId)
          );
        } catch (error) {
          console.error("Error al cancelar el turno", error);
          setCancelError("Hubo un error al cancelar el turno.");
          Swal.fire("Error", "Hubo un error al cancelar el turno", "error");
        }
      } else if (result.isDismissed) {
        // Si el usuario cancela
        console.log("Cancelación del turno cancelada");
      }
    });
  };

  const handlePostOperatorio = async (idHorario) => {
    
    try {
      const postOperatorio = await misTurnosService.obtenerPostOperatorio(idHorario);
      setPostOperatorio(postOperatorio);
      
    }
    catch {
      console.error("Error en los datos del postoperatorio");
      setPostOperatorio([]);
    }
  };
  // Función para abrir el modal con la descripción del postoperatorio
  const handleShowDetalles = (descripcion) => {
    if (descripcion.estado === "Realizado") {
      handlePostOperatorio(descripcion.idHorario);
    } 
    setShowModal(true);
  };

  const parsearHorario = (horario) => {
    let horarioCortado = horario.split(":")
    return `${horarioCortado[0] + ":" +  horarioCortado[1]}`
  }

  // Función para cerrar el modal
  const handleCloseModal = () => {setShowModal(false), setPostOperatorio([])};

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container p-2 maven-pro-body page-container">
      <div className="row justify-content-center">
        {isLoading && (
          <div className="loading-overlay">
            <DotLoader color="#60C1EA" />
          </div>
        )}
        {cancelError && <div className="alert alert-danger">{cancelError}</div>}

        {turnos.length > 0 ? (
          turnos.map((turno, index) => (
            <div key={index} className="col-md-12 p-4">
              <div className="shadow-sm border p-5 rounded">
                <div className="d-flex justify-content-between">
                  <div style={{ paddingLeft: "15px" }}>
                    <h5>{`Turno para ${turno.nombreMascota != null ?turno.nombreMascota : turno.tipoTurno }`}</h5>
                    <p>
                      <strong>Hora:</strong> {parsearHorario(turno.hora) || "No disponible"}{" "}
                      <br />
                      <strong>Día del Turno:</strong>{" "}
                      {new Date(turno.diaTurno).toLocaleDateString() ||
                        "No disponible"}{" "}
                      <br />
                      <strong>Estado:</strong>{" "}
                      {turno.estado || "No especificado"} <br />
                    </p>
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <button
                      className= {`btn btn-primary mb-2 w-100 ${turno.estado === "Realizado" ? "" : "d-none"}`}
                      onClick={() =>{
                        
                        
                        handleShowDetalles(turno)
                        
                      }}
                    >
                      Detalles
                    </button>
                    <button
                      className={`w-100 btn btn-danger ${turno.tipoTurno === "EMERGENCIA" || turno.estado === "Cancelado" ||
                        turno.estado === "Realizado" ? "d-none" : ""}`}
                      onClick={() => handleCancelarTurno(turno.idHorario, null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center mt-5">
            <h5>No se encontraron turnos asignados.</h5>
          </div>
        )}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Descripción Postoperatorio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
        {console.log(postOperatorio)}

        {postOperatorio.length > 0 ? (
          <p><strong>Recomendación:</strong> Utilizar un {
            postOperatorio[0].sexo === 'MACHO' ? 'Collar Isabelino' : 
            postOperatorio[0].sexo === 'HEMBRA' ? 'Collar Isabelino o Faja' : 
            ''
        }</p>
        ):<p>No hay datos disponibles.</p> }
        {postOperatorio.length > 0 ? (
          postOperatorio.map((item, index) => (
            <div key={index}>
              <p>🧪 <strong>Nombre:</strong> {item.medicamento}</p>
              <p>💉 <strong>Dosis:</strong> {item.dosis} {item.unidadMedida}</p>
              <p>📝 <strong>Descripción:</strong> {item.descripcion || "Sin descripción"}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>No hay datos disponibles.</p>
        )}
      </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default TurnoVecino;
