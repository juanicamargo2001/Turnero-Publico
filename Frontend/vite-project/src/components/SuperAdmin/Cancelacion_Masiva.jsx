import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // Tema azul claro
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { turnosService } from "../../services/cancelacionMasiva.service";

function CancelacionMasiva() {

  const [selectedDate, setSelectedDate] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date[0]); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!selectedDate || !motivo || !selectedCenter) {
      alert("Por favor complete todos los campos.");
      return;
    }
  
    const diaCancelacion = selectedDate.toLocaleDateString("es-ES");
    const diaCancelacionString = diaCancelacion.split("/").reverse().join("-");

    const requestCancelacionesMasivas = {
      diaCancelacion: diaCancelacionString,
      motivo: motivo,
      idCentroCastracion: [selectedCenter],
    };
  
    console.log("Datos enviados:", requestCancelacionesMasivas);
  
    try {
      const response = await turnosService.CancelarMasivamente(requestCancelacionesMasivas);
      alert("Cancelación masiva realizada con éxito");
      console.log("Respuesta del servidor:", response);
    } catch (error) {
      alert("Error al realizar la cancelación masiva.");
      console.error("Error capturado:", error);
    }
  };
  

  return (
    <div className="container maven-pro-body">
      <h3 className="maven-pro-title mt-5 mb-5">Cancelación masiva</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4 align-items-center">
          <Col sm={4}>
            <label htmlFor="fecha" className="form-label">
              Elige el día para cancelar los turnos:
            </label>
          </Col>
          <Col sm={8}>
            <Flatpickr
              value={selectedDate}
              onChange={handleDateChange}
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

        <div className="mb-4 row">
          <label htmlFor="motivo" className="col-sm-4 col-form-label">
            Ingresa el motivo:
          </label>
          <div className="col-sm-8">
            <input
              type="text"
              className="form-control"
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Ingrese el motivo"
            />
          </div>
        </div>

        <div className="mb-3 row">
          <label htmlFor="centerSelect" className="col-sm-4 col-form-label">
            Elija centro de castración:
          </label>
          <div className="col-sm-8">
            <Form.Select
                id="centerSelect"
                value={selectedCenter}
                onChange={(e) => setSelectedCenter(Number(e.target.value))} 
                >
                <option value="">Seleccione un centro</option>
                <option value={14}>CDC Alberdi</option>
                <option value={15}>CDC La France</option>
                <option value={16}>CDC Villa Allende</option>
            </Form.Select>
          </div>
        </div>

        <div className="d-flex justify-content-between m-2">
          <button type="submit" className="btn btn-primary ms-auto confir">
            Confirmar
          </button>
        </div>
      </Form>
    </div>
  );
}

export default CancelacionMasiva;
