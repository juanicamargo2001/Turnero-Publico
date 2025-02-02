import React, { useEffect, useState } from 'react';
import misTurnosService from '../services/turno/misTurnos.service';
import { Button, Card, Container, Row, Col, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

function TurnoVecino() {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState(null);
  const [cancelError, setCancelError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [postOperatorio, setPostOperatorio] = useState('');

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const data = await misTurnosService.obtenerMisTurnos();
        setTurnos(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError('Error al cargar los turnos');
        console.error(err);
      }
    };

    fetchTurnos();
  }, []);

  const handleCancelarTurno = async (idHorario) => {
    const parsedId = parseInt(idHorario);
    console.log("ID del turno después de parsear a entero:", parsedId);
  
    if (isNaN(parsedId)) {
      setCancelError("El ID del turno no es válido.");
      return;
    }
  
    // Mostrar la confirmación con SweetAlert2
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Este cambio no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cancelar Turno',
      cancelButtonText: 'Volver', 
      reverseButtons: true, 
      customClass: {
        confirmButton: 'btn-danger', // Botón "Cancelar" (confirmación)
        cancelButton: 'btn-secondary' // Botón "Volver" (cancelación)
        // cancelButton: 'btn-danger', // Clase personalizada para el botón Cancelar
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la cancelación
        try {
          // Cancelar el turno en el backend
          await misTurnosService.cancelarTurno(parsedId);
          setCancelError(null);
          console.log(`Turno con ID ${parsedId} cancelado exitosamente.`);
          
          // Mostrar un mensaje de éxito
          Swal.fire('Cancelado', `El turno con ID ${parsedId} ha sido cancelado.`, 'success');
          
          // Eliminar el turno de la lista localmente
          setTurnos((prevTurnos) => prevTurnos.filter((turno) => turno.idHorario !== parsedId));
        } catch (error) {
          console.error("Error al cancelar el turno", error);
          setCancelError("Hubo un error al cancelar el turno.");
          Swal.fire('Error', 'Hubo un error al cancelar el turno', 'error');
        }
      } else if (result.isDismissed) {
        // Si el usuario cancela
        console.log("Cancelación del turno cancelada");
      }
    });
  };
  

  // Función para abrir el modal con la descripción del postoperatorio
  const handleShowDetalles = (descripcion) => {
    setPostOperatorio(descripcion);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => setShowModal(false);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container p-2 maven-pro-body">
      <div className="row justify-content-center">
        {cancelError && <div className="alert alert-danger">{cancelError}</div>}

        {turnos.map((turno, index) => (
          <div key={index} className="col-md-12 p-4">
            <div className="shadow-sm border p-5 rounded">
              <div className="d-flex justify-content-between">
                <div>
                  <h5>{`Turno para ${turno.tipoTurno}`}</h5>
                  <p>
                    <strong>Hora:</strong> {turno.hora || "No disponible"} <br />
                    <strong>Día del Turno:</strong> {new Date(turno.diaTurno).toLocaleDateString() || "No disponible"} <br />
                    <strong>Estado:</strong> {turno.estado || "No especificado"} <br />
                  </p>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <button
                    className="btn btn-primary mb-2"
                    onClick={() => handleShowDetalles(turno.descripPostOperatorio)}
                  >
                    Detalles
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelarTurno(turno.idHorario)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Descripción Postoperatorio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{postOperatorio || 'No disponible'}</p>
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
