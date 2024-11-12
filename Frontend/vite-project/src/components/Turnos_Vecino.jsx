import React, { useEffect, useState } from 'react';
import { turnosService } from '../services/misTurnos.service';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

function TurnoVecino() {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState(null);
  const [cancelError, setCancelError] = useState(null); // Para manejar errores de cancelación

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const data = await turnosService.obtenerMisTurnos();
        setTurnos(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError('Error al cargar los turnos');
        console.error(err);
      }
    };

    fetchTurnos();
  }, []);

  const handleCancelarTurno = async (idHorario) => {
    console.log("ID del turno recibido:", idHorario); // Verifica el valor recibido
    const parsedId = parseInt(idHorario, 10); // Convertimos a entero
    if (isNaN(parsedId)) {
      console.error("El ID del turno no es un número válido.");
      setCancelError("El ID del turno no es válido."); // Muestra un error en la UI
      return;
    }
  
    try {
      await turnosService.cancelarTurno(parsedId); // Usamos parsedId para enviar
      setCancelError(null); // Si se cancela exitosamente, limpiamos el error
    } catch (error) {
      console.error("Error al cancelar el turno", error);
      setCancelError("Hubo un error al cancelar el turno."); // Muestra un error en la UI
    }
  };
  

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        {cancelError && <div className="alert alert-danger">{cancelError}</div>} {/* Mostrar error de cancelación */}

        {turnos.map((turno, index) => (
          <Col key={index} md={8} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{`Turno para ${turno.tipoTurno}`}</Card.Title>
                <Card.Text>
                  <strong>Hora:</strong> {turno.hora || "No disponible"} <br />
                  <strong>Día del Turno:</strong> {new Date(turno.diaTurno).toLocaleDateString() || "No disponible"} <br />
                  <strong>Estado:</strong> {turno.estado || "No especificado"} <br />
                  <strong>Descripción Postoperatorio:</strong> {turno.descripPostOperatorio || "No disponible"} <br />
                </Card.Text>
                <div className="d-flex justify-content-end">
                  <Button variant="primary" className="me-2">
                    Detalles
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleCancelarTurno(turno.idHorario)} // Usamos idHorario aquí
                  >
                    Cancelar Turno
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

      </Row>
    </Container>
  );
}

export default TurnoVecino;
