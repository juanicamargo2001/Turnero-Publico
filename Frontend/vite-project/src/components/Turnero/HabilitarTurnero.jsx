import { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { agendaService } from "../../services/agenda/habilitar.service";
import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import { centroService } from "../../services/centro/centro.service";
import { DotLoader } from "react-spinners";

const HabilitarTurnero = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [horaInicio] = useState(
    dayjs().set("hour", 10).set("minute", 0).set("second", 0)
  );
  const [enabledTime, setEnabledTime] = useState("10:00:00");
  const [centros, setCentros] = useState([]);
  const [turnosPorDia, setTurnosPorDia] = useState([]);
  const [centroSeleccionado, setCentroSeleccionado] = useState([]);
  const [erroresCantidad, setErroresCantidad] = useState({});
  const [data, setData] = useState([]);
  const [dataTarde, setDataTarde] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setData([
      ...data,
      {
        horarioInicio: Number(Math.floor(Math.random() * 2349403)),
        horarioFin: "",
        cantidad: "",
        idTipoTurno: 1,
      },
    ]);
  };

  const handleChange = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...data];
    onchangeVal[i][name] = value;
    setData(onchangeVal);
  };

  const handleDelete = (i) => {
    const deleteVal = [...data];
    deleteVal.splice(i, 1);
    setData(deleteVal);
  };

  const handleClickTarde = () => {
    setDataTarde([
      ...dataTarde,
      {
        idFranjaHoraria: Number(Math.floor(Math.random() * 2349403)),
        horarioInicio: "",
        horarioFin: "",
        cantidad: "",
        idTipoTurno: 1,
      },
    ]);
  };

  const handleChangeTarde = (e, i) => {
    const { name, value } = e.target;
    const onchangeVal = [...dataTarde];
    onchangeVal[i][name] = value;
    setDataTarde(onchangeVal);
  };

  const handleDeleteTarde = (i) => {
    const deleteVal = [...dataTarde];
    deleteVal.splice(i, 1);
    setDataTarde(deleteVal);
  };

  const crearFranjaHoraria = async (dataArray, esTurnoTarde) => {
    const updatedData = dataArray.map((shift) => ({
      ...shift,
      idFranjaHoraria: null,
      esTurnoTarde: esTurnoTarde,
      horarioInicio: `${shift.horarioInicio}:00`,
      horarioFin: `${shift.horarioFin}:00`,
      idCentroCastracion: Number(centroSeleccionado),
    }));

    let response = await centroService.CrearFranjaHorarias(updatedData);

    if (response) {
      Swal.fire({
        title: "¡Éxito!",
        text: "La franja horaria se registró correctamente.",
        icon: "success",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => ObtenerFranjasPorCentro(centroSeleccionado));
    } else {
      Swal.fire({
        title: "Error",
        text: "Sucedió un error inesperado!",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      });
    }
  };

  const eliminarFranjaHorarioXCentro = async (franja) => {
    let response = await centroService.EliminarFranjaHoraria(
      franja.idFranjaHoraria
    );

    if (response) {
      Swal.fire({
        title: "¡Éxito!",
        text: "La franja horaria se eliminó correctamente.",
        icon: "success",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => ObtenerFranjasPorCentro(centroSeleccionado));
    } else {
      Swal.fire({
        title: "Error",
        text: "Sucedió un error inesperado!",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      });
    }
  };

  const handleFranjaHoraria = async (e, idFranjaHoraria) => {
    const { name, value } = e.target;

    setTurnosPorDia((prevTurnos) =>
      prevTurnos.map((turno) =>
        turno.idFranjaHoraria === idFranjaHoraria
          ? { ...turno, [name]: value }
          : turno
      )
    );
  };

  const editarFranjaHoraria = async (franja) => {
    franja = [franja];

    let horariaInicialSpliteado = franja[0].horarioInicio.split(":");
    let horariaFinalSpliteado = franja[0].horarioFin.split(":");

    const updatedFranja = franja.map((shift) => ({
      ...shift,
      horarioInicio: `${horariaInicialSpliteado[0]}:${horariaInicialSpliteado[1]}:00`,
      horarioFin: `${horariaFinalSpliteado[0]}:${horariaFinalSpliteado[1]}:00`,
      idTipoTurno: Number(shift.idTipoTurno),
      cantidad: Number(shift.cantidad),
    }));

    let response = await centroService.EditarFranjaHoraria(updatedFranja[0]);

    if (response) {
      Swal.fire({
        title: "¡Éxito!",
        text: "La franja horaria se editó correctamente.",
        icon: "success",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => ObtenerFranjasPorCentro(centroSeleccionado));
    } else {
      Swal.fire({
        title: "Error",
        text: "Sucedió un error inesperado!",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      });
    }
  };

  const ObtenerFranjasPorCentro = async (idCentro) => {
    setData([]);
    setDataTarde([]);
    setCentroSeleccionado(idCentro);
    let response = await centroService.ObtenerFranjasHorarias(idCentro);

    if (response != null) {
      setTurnosPorDia(response.result);
    } else {
      setTurnosPorDia([]);
    }
  };

  const handleDateChange = (date) => {
    if (date && date.length > 0) {
      setSelectedDate(new Date(date[0]));
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const nuevaAgenda = {
      fechaInicio: selectedDate.toISOString().split("T")[0],
      horaHabilitado: enabledTime,
      centroCastracion: {
        idCentro: Number(centroSeleccionado),
        franjasHorarias: turnosPorDia.map((shift) => ({
          horaInicio: shift.horarioInicio,
          horarioFin: shift.horarioFin,
          idTipoTurno: shift.idTipoTurno,
          cantidad: shift.cantidad,
        })),
      },
    };
    try {
      const response = await agendaService.Grabar(nuevaAgenda);

      if (response.success) {
        Swal.fire({
          title: "¡Éxito!",
          text: "La agenda fue registrada con éxito.",
          icon: "success",
          confirmButtonColor: "#E15562",
          confirmButtonText: "OK",
        });
        setIsLoading(false);
      } else {
        Swal.fire({
          title: "Error!",
          text: "Sucedió un error inesperado!",
          icon: "error",
          confirmButtonColor: "#E15562",
          confirmButtonText: "OK",
        });
        setIsLoading(false);
      }
    } catch {
      Swal.fire({
        title: "Error!",
        text: "Sucedió un error inesperado!",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const response = await centroService.BuscarTodos();
        if (response.success && Array.isArray(response.result)) {
          const centrosHabilitados = response.result.filter(
            (centro) => centro.habilitado
          );
          setCentros(centrosHabilitados);
          setIsLoading(false)
        } else {
          setCentros([]);
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error al cargar los centros", error);
        setCentros([]);
        setIsLoading(false)
      }
    }

    fetchData();
  }, []);

  return (
    <div className="container maven-pro-body">
      {isLoading && (
      <div className="loading-overlay">
        <DotLoader color="#60C1EA" />
      </div>)}
      <h3 className="maven-pro-title p-4 text-center mt-2 mb-4">
        Habilitar Turnero
      </h3>
      <label
        htmlFor="idCentroCastracion"
        className="form-label"
        style={{ fontSize: "1rem" }}
      >
        Centro de Castración
      </label>
      <select
        className="form-select mb-4"
        onChange={(e) => ObtenerFranjasPorCentro(e.target.value)}
      >
        <option value="">Seleccione un centro</option>
        {centros.map((centro) => (
          <option
            key={centro.id_centro_castracion}
            value={centro.id_centro_castracion}
          >
            {centro.nombre}
          </option>
        ))}
      </select>
      {centroSeleccionado.length > 0 && (
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3 align-items-center">
            <Col sm={6}>
              <label
                htmlFor="fecha"
                className="form-label"
                style={{ fontSize: "1rem" }}
              >
                Elige el día para habilitar los turnos del próximo mes:
              </label>
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
            <label htmlFor="enableTime" className="col-sm-4 col-form-label">
              Ingresa el horario para habilitar:
            </label>
            <div className="col-sm-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  label="Horario Inicio"
                  defaultValue={horaInicio}
                  onChange={(e) => {
                    console.log(e);
                    const horarioNormal = dayjs(e).format("HH:mm:ss");
                    setEnabledTime(horarioNormal);
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

          {/* ------------------------------------------------------------------------------ TURNO MAÑANA ------------------------------------------------------------------- */}
          <h5 className="mb-4">Turno Mañana</h5>
          <Row className="justify-content-center">
            <div className="col-sm-12">
              {turnosPorDia.filter((shift) => !shift.esTurnoTarde).length >
              0 ? (
                turnosPorDia
                  .filter((shift) => !shift.esTurnoTarde)
                  .map((shift) => (
                    <Row className="mb-3" key={shift.idFranjaHoraria}>
                      <hr className="rounded"></hr>
                      <Col sm={3}>
                        <Form.Group>
                          <Form.Label>Hora Inicio*</Form.Label>
                          <Form.Control
                            type="time"
                            name="horarioInicio"
                            value={shift.horarioInicio}
                            onChange={(e) =>
                              handleFranjaHoraria(e, shift.idFranjaHoraria)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={3}>
                        <Form.Group>
                          <Form.Label>Hora Fin*</Form.Label>
                          <Form.Control
                            type="time"
                            name="horarioFin"
                            value={shift.horarioFin}
                            onChange={(e) =>
                              handleFranjaHoraria(e, shift.idFranjaHoraria)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={2}>
                        <Form.Group>
                          <Form.Label>Cantidad*</Form.Label>
                          <Form.Control
                            type="text"
                            name="cantidad"
                            value={shift.cantidad}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^[0-9]+$/.test(value)) {
                                handleFranjaHoraria(e, shift.idFranjaHoraria);
                                setErroresCantidad((prev) => ({
                                  ...prev,
                                  [shift.idFranjaHoraria]: "",
                                }));
                              } else {
                                setErroresCantidad((prev) => ({
                                  ...prev,
                                  [shift.idFranjaHoraria]: "Formato inválido",
                                }));
                              }
                            }}
                          />
                        </Form.Group>
                        {erroresCantidad[shift.idFranjaHoraria] && (
                          <p style={{ color: "red" }}>
                            {erroresCantidad[shift.idFranjaHoraria]}
                          </p>
                        )}
                      </Col>
                      <Col sm={2}>
                        <Form.Group>
                          <Form.Label>Tipo*</Form.Label>
                          <Form.Select
                            name="idTipoTurno"
                            value={shift.idTipoTurno}
                            onChange={(e) =>
                              handleFranjaHoraria(e, shift.idFranjaHoraria)
                            }
                            className="form-control"
                          >
                            <option value={1}>Gato</option>
                            <option value={2}>Perro</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={1} className="d-flex align-items-center mt-3">
                        <Button
                          style={{ color: "black" }}
                          onClick={() => editarFranjaHoraria(shift)}
                          className="bg-info"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Button>
                      </Col>
                      <Col sm={1} className="d-flex align-items-center mt-3">
                        <Button
                          variant="danger"
                          className="botonEliminarAgenda"
                          onClick={() => eliminarFranjaHorarioXCentro(shift)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  ))
              ) : (
                <h5 className="text-center text-muted mt-3">
                  No se encontraron turnos
                </h5>
              )}

              {/* ------------------------------------------------------------------ Turno Mañana agregado --------------------------------------------------------------------- */}
              {data.map((shift, i) => (
                <Row className="mb-2" key={shift.idFranjaHoraria}>
                  <hr></hr>
                  <Col sm={3}>
                    <Form.Group>
                      <Form.Label>Hora Inicio*</Form.Label>
                      <Form.Control
                        name="horarioInicio"
                        type="time"
                        onChange={(e) => handleChange(e, i)}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Form.Group>
                      <Form.Label>Hora Fin*</Form.Label>
                      <Form.Control
                        name="horarioFin"
                        type="time"
                        onChange={(e) => handleChange(e, i)}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={2}>
                    <Form.Group>
                      <Form.Label>Cantidad*</Form.Label>
                      <Form.Control
                        name="cantidad"
                        type="text"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^[0-9]+$/.test(value)) {
                            handleChange(e, i);
                            setErroresCantidad((prev) => ({
                              ...prev,
                              [shift.idFranjaHoraria]: "",
                            }));
                          } else {
                            setErroresCantidad((prev) => ({
                              ...prev,
                              [shift.idFranjaHoraria]: "Formato inválido",
                            }));
                          }
                        }}
                      />
                    </Form.Group>
                    {erroresCantidad[shift.idFranjaHoraria] && (
                      <p style={{ color: "red" }}>
                        {erroresCantidad[shift.idFranjaHoraria]}
                      </p>
                    )}
                  </Col>
                  <Col sm={2}>
                    <Form.Group>
                      <Form.Label>Tipo*</Form.Label>
                      <Form.Select
                        name="idTipoTurno"
                        onChange={(e) => handleChange(e, i)}
                        className="form-control"
                      >
                        <option value={1}>Gato</option>
                        <option value={2}>Perro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {/*------------------------------------------------------------------ Botones Mañana -------------------------------------------------------------------*/}
                  <Col sm={1} className="d-flex align-items-center mt-3">
                    <Button
                      variant="success"
                      style={{ color: "white" }}
                      onClick={() => crearFranjaHoraria(data, false)}
                    >
                      <i
                        className="fa-solid fa-check"
                        style={{ fontSize: "1rem" }}
                      ></i>
                    </Button>
                  </Col>
                  <Col sm={1} className="d-flex align-items-center mt-3">
                    <Button
                      variant="danger"
                      className="botonEliminarAgenda"
                      onClick={() => handleDelete(i)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              ))}
            </div>
          </Row>

          <Row className="justify-content-center mt-3 mb-4">
            <Col sm={5} className="text-center">
              <Button
                variant="info"
                style={{ color: "black" }}
                onClick={handleClick}
              >
                + Agregar Franja Horaria
              </Button>
            </Col>
          </Row>

          {/* -------------------------------------------------------- TURNO TARDE ------------------------------------------------------------------ */}
          <h5 className="mb-4">Turno Tarde</h5>
          <Row className="justify-content-center">
            <div className="col-sm-12">
              {turnosPorDia.filter((shift) => shift.esTurnoTarde).length > 0 ? (
                turnosPorDia
                  .filter((shift) => shift.esTurnoTarde)
                  .map((shift) => (
                    <Row className="mb-3" key={shift.idFranjaHoraria}>
                      <hr></hr>
                      <Col sm={3}>
                        <Form.Group>
                          <Form.Label>Hora Inicio*</Form.Label>
                          <Form.Control
                            type="time"
                            name="horarioInicio"
                            value={shift.horarioInicio}
                            onChange={(e) =>
                              handleFranjaHoraria(e, shift.idFranjaHoraria)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={3}>
                        <Form.Group>
                          <Form.Label>Hora Fin*</Form.Label>
                          <Form.Control
                            type="time"
                            name="horarioFin"
                            value={shift.horarioFin}
                            onChange={(e) =>
                              handleFranjaHoraria(e, shift.idFranjaHoraria)
                            }
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={2}>
                        <Form.Group>
                          <Form.Label>Cantidad*</Form.Label>
                          <Form.Control
                            type="text"
                            value={shift.cantidad}
                            name="cantidad"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || /^[0-9]+$/.test(value)) {
                                handleFranjaHoraria(e, shift.idFranjaHoraria);
                                setErroresCantidad((prev) => ({
                                  ...prev,
                                  [shift.idFranjaHoraria]: "",
                                }));
                              } else {
                                setErroresCantidad((prev) => ({
                                  ...prev,
                                  [shift.idFranjaHoraria]: "Formato inválido",
                                }));
                              }
                            }}
                          />
                        </Form.Group>
                        {erroresCantidad[shift.idFranjaHoraria] && (
                          <p style={{ color: "red" }}>
                            {erroresCantidad[shift.idFranjaHoraria]}
                          </p>
                        )}
                      </Col>
                      <Col sm={2}>
                        <Form.Group>
                          <Form.Label>Tipo*</Form.Label>
                          <Form.Select
                            value={shift.idTipoTurno}
                            name="idTipoTurno"
                            onChange={(e) =>
                              handleFranjaHoraria(e, shift.idFranjaHoraria)
                            }
                            className="form-control"
                          >
                            <option value={1}>Gato</option>
                            <option value={2}>Perro</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col sm={1} className="d-flex align-items-center mt-3">
                        <Button
                          style={{ color: "black" }}
                          onClick={() => editarFranjaHoraria(shift)}
                          className="bg-info"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </Button>
                      </Col>
                      <Col sm={1} className="d-flex align-items-center mt-3">
                        <Button
                          variant="danger"
                          className="botonEliminarAgenda"
                          onClick={() => eliminarFranjaHorarioXCentro(shift)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                      </Col>
                    </Row>
                  ))
              ) : (
                <h5 className="text-center text-muted mt-3">
                  No se encontraron turnos
                </h5>
              )}
              {/*--------------------------------------------------------- Turno tarde agregar ---------------------------------------------*/}
              {dataTarde.map((shift, i) => (
                <Row className="mb-2" key={shift.idFranjaHoraria}>
                  <hr></hr>
                  <Col sm={3}>
                    <Form.Group>
                      <Form.Label>Hora Inicio*</Form.Label>
                      <Form.Control
                        name="horarioInicio"
                        type="time"
                        onChange={(e) => handleChangeTarde(e, i)}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={3}>
                    <Form.Group>
                      <Form.Label>Hora Fin*</Form.Label>
                      <Form.Control
                        name="horarioFin"
                        type="time"
                        onChange={(e) => handleChangeTarde(e, i)}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={2}>
                    <Form.Group>
                      <Form.Label>Cantidad*</Form.Label>
                      <Form.Control
                        name="cantidad"
                        type="text"
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^[0-9]+$/.test(value)) {
                            handleChangeTarde(e, i);
                            setErroresCantidad((prev) => ({
                              ...prev,
                              [shift.idFranjaHoraria]: "",
                            }));
                          } else {
                            setErroresCantidad((prev) => ({
                              ...prev,
                              [shift.idFranjaHoraria]: "Formato inválido",
                            }));
                          }
                        }}
                      />
                    </Form.Group>
                    {erroresCantidad[shift.idFranjaHoraria] && (
                      <p style={{ color: "red" }}>
                        {erroresCantidad[shift.idFranjaHoraria]}
                      </p>
                    )}
                  </Col>
                  <Col sm={2}>
                    <Form.Group>
                      <Form.Label>Tipo*</Form.Label>
                      <Form.Select
                        name="idTipoTurno"
                        onChange={(e) => handleChangeTarde(e, i)}
                        className="form-control"
                      >
                        <option value={1}>Gato</option>
                        <option value={2}>Perro</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col sm={1} className="d-flex align-items-center mt-3">
                    <Button
                      variant="success"
                      style={{ color: "white" }}
                      onClick={() => crearFranjaHoraria(dataTarde, true)}
                    >
                      <i
                        className="fa-solid fa-check"
                        style={{ fontSize: "1rem" }}
                      ></i>
                    </Button>
                  </Col>
                  <Col sm={1} className="d-flex align-items-center mt-3">
                    <Button
                      variant="danger"
                      className="botonEliminarAgenda"
                      onClick={() => handleDeleteTarde(i)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              ))}
              <Row className="justify-content-center mt-4">
                <Col sm={5} className="text-center">
                  <Button
                    variant="info"
                    style={{ color: "black" }}
                    onClick={handleClickTarde}
                  >
                    + Agregar Franja Horaria
                  </Button>
                </Col>
              </Row>
            </div>
          </Row>

          <div className="d-flex justify-content-between mt-4 mb-5">
            <button type="submit" className="btn btn-primary ms-auto confir">
              Confirmar
            </button>
          </div>
        </Form>
      )}
    </div>
  );
};
export default HabilitarTurnero;
