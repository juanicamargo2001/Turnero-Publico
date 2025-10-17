import { useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; 
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { turnosService } from "../../services/turno/cancelacionMasiva.service";
import Swal from 'sweetalert2';

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
      Swal.fire({
        text: "Por favor complete todos los campos.",
        icon: "info",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => {
    });
      return;
    }
  
    // const diaCancelacion = selectedDate.toLocaleDateString("es-ES");
    // const diaCancelacionString = diaCancelacion.split("/").reverse().join("-");
    const dia = selectedDate.getDate().toString().padStart(2, '0');
    const mes = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const anio = selectedDate.getFullYear();
    const diaCancelacionString = `${anio}-${mes}-${dia}`;

    const requestCancelacionesMasivas = {
      diaCancelacion: diaCancelacionString,
      motivo: motivo,
      idCentroCastracion: [selectedCenter],
    };
  
    console.log("Datos enviados:", requestCancelacionesMasivas);
  
    try {
      const response = await turnosService.CancelarMasivamente(requestCancelacionesMasivas);
      Swal.fire({
              title: "¡Éxito!",
              text: "Cancelado con éxito",
              icon: "success",
              confirmButtonColor: "#E15562",
              confirmButtonText: "OK",
            });
      console.log("Respuesta del servidor:", response);
    } catch {
      Swal.fire({
        title: "¡Error!",
        text: "Error al realizar la cancelación masiva.",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      });
    }
  };
  

  return (
    <div className="container maven-pro-body">
      <h3 className="maven-pro-title mt-5 mb-5">Cancelación masiva</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-4 align-items-center">
          <Col sm={4}>
            <label htmlFor="fecha" className="form-label" style={{fontSize: "1rem"}}>
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
          <label htmlFor="motivo" className="col-sm-4 col-form-label" style={{fontSize: "1rem"}}>
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
