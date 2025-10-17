import { useEffect, useState } from "react";
import { Tab, Tabs, Row, Col, Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import { reportesService } from "../../services/reporte/reportes.service";
import { DotLoader } from "react-spinners";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COLORS = ["#14B3B7", "#878BB6"]; 

const Reportes = () => {
  const [dataTipoAnimal, setDataTipoAnimal] = useState(null);
  const [dataCancelaciones, setDataCancelaciones] = useState(null);
  const [error, setError] = useState(null);
  const [key, setKey] = useState("tipo-animal");

  const [fechaDesde, setFechaDesde] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [fechaHasta, setFechaHasta] = useState(new Date());

  const [tipoAnimal, setTipoAnimal] = useState("PERRO");
  const [dataRazas, setDataRazas] = useState(null);
  const [errorRazas, setErrorRazas] = useState(null);
  const [loadingRazas, setLoadingRazas] = useState(false);

  const fetchRazaData = async () => {
    setLoadingRazas(true);
    try {
      const result = await reportesService.obtenerInformeRazas(tipoAnimal, fechaDesde, fechaHasta);
      setDataRazas(result.result); 
      setErrorRazas(null);
    } catch (err) {
      setErrorRazas("Error al obtener datos de razas");
      setDataRazas(null);
    }
    setLoadingRazas(false);
};

  const fetchData = async () => {
    try {
      const resultTipoAnimal = await reportesService.obtenerInformeTipoAnimal(fechaDesde, fechaHasta);
      setDataTipoAnimal(resultTipoAnimal.result);

      const resultCancelaciones = await reportesService.obtenerInformeCancelaciones(fechaDesde, fechaHasta);
      setDataCancelaciones(resultCancelaciones.result);
    } catch {
      setError("Error al cargar los datos del gráfico.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [fechaDesde, fechaHasta]);

  // if (error) {
  //   return <div className="alert alert-danger">{error}</div>;
  // }

  if (!dataTipoAnimal || !dataCancelaciones) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <DotLoader color="#60C1EA" />
      </div>
    );
  }

  const pieDataTipoAnimal = [
    { name: "Gatos", value: dataTipoAnimal.gatos , porcentaje: dataTipoAnimal.porcentajeGato },
    { name: "Perros",value: dataTipoAnimal.perros, porcentaje: dataTipoAnimal.porcentajePerro },
  ];

  const barDataTipoAnimal = [
    { name: "Gatos", value: dataTipoAnimal.gatos, porcentaje: dataTipoAnimal.porcentajeGato },
    { name: "Perros", value: dataTipoAnimal.perros, porcentaje: dataTipoAnimal.porcentajePerro },
  ];

  const pieDataCancelaciones = [
    { name: "Cancelados", value: dataCancelaciones.cancelados , porcentaje: dataCancelaciones.porcentajeCancelados },
    { name: "Confirmados", value: dataCancelaciones.confirmados, porcentaje: dataCancelaciones.porcentajeConfirmados },
  ];

  const barDataCancelaciones = [
    { name: "Cancelados", value: dataCancelaciones.cancelados, porcentaje: dataCancelaciones.porcentajeCancelados },
    { name: "Confirmados", value: dataCancelaciones.confirmados, porcentaje: dataCancelaciones.porcentajeConfirmados },
  ];

  const renderCustomBarLabel = (props) => {
    const { x, y, width, value, index } = props;
    const item = barDataCancelaciones[index];

    if (!item) return null;

    return (
      <Text fill="#000" textAnchor="start" fontSize={15}>
        {item.name}
      </Text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="custom-tooltip bg-white p-2 border rounded shadow-sm">
          <strong>{name}</strong>: {value}
        </div>
      );
    }
  
    return null;
  }

  const renderDatePickers = () => (
    <div className="d-flex gap-3 mb-3 align-items-center">
      <div>
        <label>Desde:</label>
        <DatePicker
          selected={fechaDesde}
          onChange={(date) => setFechaDesde(date)}
          className="form-control"
          dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
        />
      </div>
      <div>
        <label>Hasta:</label>
        <DatePicker
          selected={fechaHasta}
          onChange={(date) => setFechaHasta(date)}
          className="form-control"
          dateFormat="dd/MM/yyyy"
        />
      </div>
    </div>
  );



  return (
    <div className="container mt-4 maven-pro-body">
      <h3 className="text-center mb-4 maven-pro-title">Reportes generales</h3>
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} id="reportes-tabs" className="custom-tabs m-4">
        {/* Pestaña Tipo Animal */}
        <Tab eventKey="tipo-animal" title="Tipo de Animal Castrado">
          {renderDatePickers()}
          {!pieDataTipoAnimal || pieDataTipoAnimal.every(d => d.value === 0) ? (
            <div className="text-center text-muted mt-4">
              No hay estadísticas para las fechas seleccionadas.
            </div>
          ) : (
            <Row>
              <Col md={7}>
                <Card>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieDataTipoAnimal}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          label={({ name, index }) =>
                            `${name}: ${pieDataTipoAnimal[index]?.porcentaje.toFixed(2)}%`
                          }
                        >
                          {pieDataTipoAnimal.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={5}>
                <Card>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={barDataTipoAnimal}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#FF8153" label={renderCustomBarLabel} />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>


        {/* Pestaña Cancelaciones */}
        <Tab eventKey="cancelaciones" title="Confirmados y Cancelados">
          {renderDatePickers()}
          {!pieDataCancelaciones || pieDataCancelaciones.every(d => d.value === 0) ? (
            <div className="text-center text-muted mt-4">
              No hay estadísticas para las fechas seleccionadas.
            </div>
          ) : (
          <Row>
            <Col md={7}>
              <Card>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                      <Pie
                        data={pieDataCancelaciones}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={75}
                        fill="#8884d8"
                        label={({ name, index }) =>
                          `${name}: ${pieDataCancelaciones[index]?.porcentaje.toFixed(2)}%`
                        }
                      >
                        {pieDataCancelaciones.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <PieTooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barDataCancelaciones}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#FF8153" label={renderCustomBarLabel} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          )}
        </Tab>

        {/* Pestaña Razas */}
        <Tab eventKey="por-raza" title="Castraciones por Raza">
          {renderDatePickers()}
        
          <div>
              <label>Tipo de animal:</label>
              <select
                value={tipoAnimal}
                onChange={(e) => setTipoAnimal(e.target.value)}
                className="form-control"
              >
                <option value="PERRO">Perro</option>
                <option value="GATO">Gato</option>
              </select>
            </div>
          
          <div>
            <button onClick={fetchRazaData} className="btn btn-primary mt-4 mb-3">
              Buscar
            </button>
          </div>
          {loadingRazas ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
              <DotLoader color="#60C1EA" />
            </div>
          ) : errorRazas ? (
            <div className="alert alert-danger">{errorRazas}</div>
          ) : !dataRazas || dataRazas.length === 0 ? (
            <div className="text-center text-muted mt-4">
              No hay estadísticas disponibles para las fechas seleccionadas.
            </div>
          ) : (
            <Row>
              <Col>
                <Card>
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={dataRazas}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="raza" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="cantidad" fill="#14B3B7" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Tab>
          
      </Tabs>
    </div>
  );
};

export default Reportes;
