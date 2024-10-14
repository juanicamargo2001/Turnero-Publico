import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js'; 
import { agendaService } from '../../services/habilitar.service';

const HabilitarTurnero = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosPorDia, setTurnosPorDia] = useState({
    laFrance: { total: 20, perros: 20, gatos: 20 },
    alberdi: { total: 20, perros: 20, gatos: 20 },
    villaAllende: { total: 20, perros: 20, gatos: 20 },
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTurnosChange = (e, centro, tipo) => {
    setTurnosPorDia({
      ...turnosPorDia,
      [centro]: {
        ...turnosPorDia[centro],
        [tipo]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaAgenda = {
      fechaInicio: selectedDate.toISOString().split('T')[0], 
      centroCastraciones: [
        {
          idCentro: 14,
          cantidadTurnosGatos: turnosPorDia.laFrance.gatos,
          cantidadTurnosPerros: turnosPorDia.laFrance.perros,
          cantidadTurnosEmergencia: 0, // Emergencia fijo a 0
        },
        {
          idCentro: 15,
          cantidadTurnosGatos: turnosPorDia.alberdi.gatos,
          cantidadTurnosPerros: turnosPorDia.alberdi.perros,
          cantidadTurnosEmergencia: 0,
        },
        {
          idCentro: 16, 
          cantidadTurnosGatos: turnosPorDia.villaAllende.gatos,
          cantidadTurnosPerros: turnosPorDia.villaAllende.perros,
          cantidadTurnosEmergencia: 0,
        }
      ]
    };
    //prueba
    console.log("Datos que se envían:", JSON.stringify(nuevaAgenda, null, 2)); 
    try {
      const response = await agendaService.Grabar(nuevaAgenda);
      console.log('Agenda registrada con éxito:', response);
    } catch (error) {
      console.error('Error al registrar la agenda:', error);
    }
  };

  return (
    <div className="container maven-pro-body">
      <h3 className="maven-pro-title p-4">Habilitar Turnero</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3 align-items-center">
          <Col sm={6}>
            <label htmlFor="fecha" className="form-label">Elige el día para habilitar los turnos del próximo mes:</label>
          </Col>
          <Col sm={6}>
            <Flatpickr
              value={selectedDate}
              onChange={(date) => handleDateChange(date)}
              options={{
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
                locale: Spanish,
              }}
              className="form-control"
              placeholder="Seleccione la fecha"
            />
          </Col>
        </Row>

        <h5 className="mt-4 cct">Cantidad de turnos por día en cada CDC:</h5>

        {/* CENTRO DE CASTRACIÓN LA FRANCE */}
        <Form.Group as={Row} className="mb-4">
          <Form.Label column sm={6}>
            CENTRO DE CASTRACIÓN LA FRANCE:
          </Form.Label>
          <Col sm={3}>
            <label className="form-label">Para perros*</label>
            <Form.Control
              type="number"
              value={turnosPorDia.laFrance.perros}
              onChange={(e) => handleTurnosChange(e, 'laFrance', 'perros')}
            />
          </Col>
          <Col sm={3}>
            <label className="form-label">Para gatos*</label>
            <Form.Control
              type="number"
              value={turnosPorDia.laFrance.gatos}
              onChange={(e) => handleTurnosChange(e, 'laFrance', 'gatos')}
            />
          </Col>
        </Form.Group>

        {/* CENTRO DE CASTRACIÓN ALBERDI */}
        <Form.Group as={Row} className="mb-4">
          <Form.Label column sm={6}>
            CENTRO DE CASTRACIÓN ALBERDI:
          </Form.Label>
          <Col sm={3}>
            <label className="form-label">Para perros*</label>
            <Form.Control
              type="number"
              value={turnosPorDia.alberdi.perros}
              onChange={(e) => handleTurnosChange(e, 'alberdi', 'perros')}
            />
          </Col>
          <Col sm={3}>
            <label className="form-label">Para gatos*</label>
            <Form.Control
              type="number"
              value={turnosPorDia.alberdi.gatos}
              onChange={(e) => handleTurnosChange(e, 'alberdi', 'gatos')}
            />
          </Col>
        </Form.Group>

        {/* CENTRO DE CASTRACIÓN VILLA ALLENDE */}
        <Form.Group as={Row} className="mb-4">
          <Form.Label column sm={6}>
            CENTRO DE CASTRACIÓN VILLA ALLENDE:
          </Form.Label>
          <Col sm={3}>
            <label className="form-label">Para perros*</label>
            <Form.Control
              type="number"
              value={turnosPorDia.villaAllende.perros}
              onChange={(e) => handleTurnosChange(e, 'villaAllende', 'perros')}
            />
          </Col>
          <Col sm={3}>
            <label className="form-label">Para gatos*</label>
            <Form.Control
              type="number"
              value={turnosPorDia.villaAllende.gatos}
              onChange={(e) => handleTurnosChange(e, 'villaAllende', 'gatos')}
            />
          </Col>
        </Form.Group>

        <div className="d-flex justify-content-end p-2">
          <button type="button" className="btn btn-dark me-2 confir2">Volver</button>
          <button type="submit" className="btn btn-primary confir">Confirmar</button>
        </div>
      </Form>
    </div>
  );
};

export default HabilitarTurnero;
