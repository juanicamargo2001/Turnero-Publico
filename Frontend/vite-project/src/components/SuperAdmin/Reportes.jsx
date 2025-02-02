import React, { useEffect, useState } from "react";
import { Tab, Tabs, Row, Col, Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Text } from "recharts";
import { PieChart, Pie, Cell, Tooltip as PieTooltip } from "recharts";
import { reportesService } from "../../services/reporte/reportes.service";
import { DotLoader } from "react-spinners";

const COLORS = ["#14B3B7", "#878BB6"]; 

const Reportes = () => {
  const [dataTipoAnimal, setDataTipoAnimal] = useState(null);
  const [dataCancelaciones, setDataCancelaciones] = useState(null);
  const [error, setError] = useState(null);
  const [key, setKey] = useState("tipo-animal"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resultTipoAnimal = await reportesService.obtenerInformeTipoAnimal();
        setDataTipoAnimal(resultTipoAnimal.result);

        const resultCancelaciones = await reportesService.obtenerInformeCancelaciones();
        setDataCancelaciones(resultCancelaciones.result);
      } catch (error) {
        setError("Error al cargar los datos del gráfico.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Cargando los gráficos
  if (!dataTipoAnimal || !dataCancelaciones) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <DotLoader color="#60C1EA" />
      </div>
    );
  }

  const pieDataTipoAnimal = [
    { name: "Gatos", value: dataTipoAnimal.porcentajeGato },
    { name: "Perros", value: dataTipoAnimal.porcentajePerro },
  ];

  const barDataTipoAnimal = [
    { name: "Gatos", value: dataTipoAnimal.gatos, porcentaje: dataTipoAnimal.porcentajeGato },
    { name: "Perros", value: dataTipoAnimal.perros, porcentaje: dataTipoAnimal.porcentajePerro },
  ];

  const pieDataCancelaciones = [
    { name: "Cancelados", value: dataCancelaciones.porcentajeCancelados },
    { name: "Confirmados", value: dataCancelaciones.porcentajeConfirmados },
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
      <Text
        fill="#000"
        textAnchor="start"
        fontSize={15}
      >
        {item.name}
      </Text>
    );
  };

  return (
    <div className="container mt-4 maven-pro-body">
      <h3 className="text-center mb-4 maven-pro-title">Estadisticas de turnos</h3>
      <Tabs
        activeKey={key}
        onSelect={(k) => setKey(k)}
        id="reportes-tabs"
        className="custom-tabs m-4"
      >
        {/* Pestaña Tipo Animal */}
        <Tab eventKey="tipo-animal" title="Tipo de animal">
          <Row>
            <Col md={6}>
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
                        label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                      >
                        {pieDataTipoAnimal.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <PieTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barDataTipoAnimal}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#FF8153"
                        label={renderCustomBarLabel}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Pestaña Cancelaciones */}
        <Tab eventKey="cancelaciones" title="Confirmados y cancelados">
          <Row>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieDataCancelaciones}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#FF8153"
                        label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                      >
                        {pieDataCancelaciones.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <PieTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barDataCancelaciones}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#FF8153"
                        label={renderCustomBarLabel}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Reportes;
