import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from 'flatpickr/dist/l10n/es.js'; 
import { agendaService } from '../../services/agenda/habilitar.service';
import Swal from 'sweetalert2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';

const HabilitarTurneroAlberi = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [horaInicio] = useState(dayjs().set('hour', 10).set('minute', 0).set('second', 0));
  const [enabledTime, setEnabledTime] = useState('10:00:00'); 
  const [turnosPorDia, setTurnosPorDia] = useState({
    shifts: [
      { horaInicio: '07:00:00', horarioFin: '08:30:00', idTipoTurno: 1, cantidad: 8 }, // Gatos
      { horaInicio: '08:30:00', horarioFin: '10:00:00', idTipoTurno: 2, cantidad: 8 }, // Perros
      { horaInicio: '10:00:00', horarioFin: '11:30:00', idTipoTurno: 1, cantidad: 8 }, // Gatos
      { horaInicio: '11:30:00', horarioFin: '13:00:00', idTipoTurno: 2, cantidad: 8 }, // Perros
      { horaInicio: '13:00:00', horarioFin: '14:30:00', idTipoTurno: 1, cantidad: 8 }, // Gatos
      { horaInicio: '14:30:00', horarioFin: '16:00:00', idTipoTurno: 2, cantidad: 8 }, // Perros
      { horaInicio: '16:00:00', horarioFin: '17:30:00', idTipoTurno: 1, cantidad: 8 }, // Gatos
      { horaInicio: '17:30:00', horarioFin: '19:00:00', idTipoTurno: 2, cantidad: 8 }  // Perros
    ],
  });

  const handleDateChange = (date) => {
    if (date && date.length > 0) {
      setSelectedDate(new Date(date[0]));
    }
  };

  const handleTurnosChange = (e, index) => {
    const value = Number(e.target.value);
    const newShifts = [...turnosPorDia.shifts];
    newShifts[index].cantidad = value;
    setTurnosPorDia({ shifts: newShifts });
  };

  const handleShiftChange = (index, type, value) => {
    const newShifts = [...turnosPorDia.shifts];
    newShifts[index][type] = value + ':00'; // Aseguramos que se añadan los segundos
    setTurnosPorDia({ shifts: newShifts });
  };

  const handleTipoTurnoChange = (index, value) => {
    const newShifts = [...turnosPorDia.shifts];
    newShifts[index].idTipoTurno = value;
    setTurnosPorDia({ shifts: newShifts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaAgenda = {
      fechaInicio: selectedDate.toISOString().split('T')[0], 
      horaHabilitado: enabledTime,
      centroCastracion: {
        idCentro: 14, 
        franjasHorarias: turnosPorDia.shifts.map((shift) => ({
          horaInicio: shift.horaInicio,
          horarioFin: shift.horarioFin,
          idTipoTurno: shift.idTipoTurno, 
          cantidad: shift.cantidad,
        })),
      },
    };

    console.log("Datos que se envían:", JSON.stringify(nuevaAgenda, null, 2)); 
    // try {
    //   const response = await agendaService.Grabar(nuevaAgenda);
    //   Swal.fire({
    //     title: "¡Éxito!",
    //     text: "La agenda fue registrada con éxito.",
    //     icon: "success",
    //     confirmButtonColor: "#E15562",
    //     confirmButtonText: "OK",
    //   });
    //   console.log('Agenda registrada con éxito:', response);
    // } catch (error) {
    //   console.error('Error al registrar la agenda:', error);
    // }
  };

  return (
    <div className="container maven-pro-body">
      <h3 className="maven-pro-title p-4">Habilitar Turnero ALBERDI</h3>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3 align-items-center">
          <Col sm={6}>
            <label htmlFor="fecha" className="form-label">Elige el día para habilitar los turnos del próximo mes:</label>
          </Col>
          <Col sm={6}>
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
        <div className="mb-3 row">
          <label htmlFor="enableTime" className="col-sm-4 col-form-label">Ingresa el horario para habilitar:</label>
          <div className="col-sm-4">
            {/* <input 
              type="time" 
              className="form-control" 
              id="enableTime" 
              value={enabledTime} 
              onChange={(e) => {
                const timeValue = e.target.value;
                setEnabledTime(`${timeValue}:00`); 
              }} 
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Horario Inicio"
                        defaultValue={horaInicio}
                        onChange={(e) => {
                          const timeValue = e.target.value;
                          setEnabledTime(`${timeValue}:00`); 
                        }}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
            </LocalizationProvider>
          </div>
        </div>

        <h5 className="mt-4 cct">Cantidad de turnos por día:</h5>
        <h5 className="mb-4">Turno Mañana</h5>
        <Row className="justify-content-center">
          <div className="col-sm-8">
            {turnosPorDia.shifts.slice(0, 4).map((shift, index) => ( 
              <Row className="mb-3" key={index}>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Hora Inicio*</Form.Label>
                    <Form.Control 
                      type="time" 
                      value={shift.horaInicio.split(':').slice(0, 2).join(':')} // Muestra solo hora y minuto
                      onChange={(e) => handleShiftChange(index, 'horaInicio', e.target.value)} 
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Hora Fin*</Form.Label>
                    <Form.Control 
                      type="time" 
                      value={shift.horarioFin.split(':').slice(0, 2).join(':')} // Muestra solo hora y minuto
                      onChange={(e) => handleShiftChange(index, 'horarioFin', e.target.value)} 
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Cantidad*</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={shift.cantidad} 
                      onChange={(e) =>{
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          handleTurnosChange(e, index)
                      }}}
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Tipo*</Form.Label>
                    <Form.Select
                      value={shift.idTipoTurno}
                      onChange={(e) => handleTipoTurnoChange(index, Number(e.target.value))}
                      className="form-control"
                    >
                      <option value={1}>Gato</option>
                      <option value={2}>Perro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            ))}
          </div>
        </Row>

        <h5 className="mb-4">Turno Tarde</h5>
        
        <Row className="justify-content-center">
          <div className="col-sm-8">
            {turnosPorDia.shifts.slice(4, 8).map((shift, index) => (
              <Row className="mb-3" key={index + 4}>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Hora Inicio*</Form.Label>
                    <Form.Control 
                      type="time" 
                      value={shift.horaInicio.split(':').slice(0, 2).join(':')} // Muestra solo hora y minuto
                      onChange={(e) => handleShiftChange(index + 4, 'horaInicio', e.target.value)} 
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Hora Fin*</Form.Label>
                    <Form.Control 
                      type="time" 
                      value={shift.horarioFin.split(':').slice(0, 2).join(':')}
                      onChange={(e) => handleShiftChange(index + 4, 'horarioFin', e.target.value)} 
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Cantidad*</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={shift.cantidad} 
                      onChange={(e) =>{
                        const value = e.target.value;
                        if (value === '' || /^[0-9]+$/.test(value)) {
                          handleTurnosChange(e, index + 4)
                      }}}
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group>
                    <Form.Label>Tipo*</Form.Label>
                    <Form.Select
                      value={shift.idTipoTurno}
                      onChange={(e) => handleTipoTurnoChange(index + 4, Number(e.target.value))}
                      className="form-control"
                    >
                      <option value={1}>Gato</option>
                      <option value={2}>Perro</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            ))}
          </div>
        </Row>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>
      </Form>
    </div>
  );
};

export default HabilitarTurneroAlberi;
