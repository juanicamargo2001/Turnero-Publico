import React, { useEffect, useState } from 'react';
import { turnosService } from '../services/misTurnos.service';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';

function TurnoVecino() {
  const [turnos, setTurnos] = useState([]);
  const [error, setError] = useState(null);
  const [cancelError, setCancelError] = useState(null);

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
    const parsedId = parseInt(idHorario);
    console.log("ID del turno después de parsear a entero:", parsedId);
    if (isNaN(parsedId)) {
      console.error("El ID del turno no es un número válido.");
      setCancelError("El ID del turno no es válido.");
      return;
    }

    try {
      await turnosService.cancelarTurno(parsedId);
      setCancelError(null);
      console.log(`Turno con ID ${parsedId} cancelado exitosamente.`);
    } catch (error) {
      console.error("Error al cancelar el turno", error);
      setCancelError("Hubo un error al cancelar el turno.");
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center">
        {cancelError && <div className="alert alert-danger">{cancelError}</div>}

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
                    onClick={() => handleCancelarTurno(turno.idHorario)}
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
