import { useEffect, useState } from "react";
import { centroService } from "../../services/centro/centro.service";
import { DotLoader } from "react-spinners";
import { calificacionService } from "../../services/vecino/calificacion.service";
import { Card, Container } from "react-bootstrap";

const MostrarCalificaciones = () => {
  const [centros, setCentros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [calificaciones, setCalificaciones] = useState([]);

  const ObtenerCalificacionPorCentro = async (idCentro) => {
    let response = await calificacionService.ObtenerCalificacionPorIdCentro(
      idCentro
    );
    console.log(response);
    if (response != null) {
      setCalificaciones(response.result);
    } else {
      setCalificaciones([]);
    }
  };

  const renderStars = (rating) => {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? "★" : "☆";
    }
    return <span className="text-warning fs-5">{stars}</span>;
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const response = await centroService.BuscarTodos();
        if (response.success && Array.isArray(response.result)) {
          const centrosHabilitados = response.result.filter(
            (centro) => centro.habilitado
          );
          setCentros(centrosHabilitados);
          setIsLoading(false);
        } else {
          setCentros([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error al cargar los centros", error);
        setCentros([]);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log(centros);

  return (
    <div className="container maven-pro-body">
      {isLoading && (
        <div className="loading-overlay">
          <DotLoader color="#60C1EA" />
        </div>
      )}
      <h3 className="maven-pro-title p-4 text-center mt-2 mb-4">
        Calificaciones
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
        onChange={(e) => ObtenerCalificacionPorCentro(e.target.value)}
      >
        <option value="">Seleccione un centro</option>

        {centros.length > 0 &&
          centros.map((centro) => (
            <option
              key={centro.id_centro_castracion}
              value={centro.id_centro_castracion}
            >
              {centro.nombre}
            </option>
          ))}
      </select>

      <Container className="mt-4">
        {calificaciones.length > 0 ? (
          calificaciones.map((calificacion, index) => (
            <Card key={index} className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>
                  {calificacion.nombre.charAt(0).toUpperCase() +
                    calificacion.nombre.slice(1).toLowerCase()}{" "}
                  {calificacion.apellido.charAt(0).toUpperCase() +
                    calificacion.apellido.slice(1).toLowerCase()}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Calificación: {renderStars(calificacion.numeroCalificacion)}
                </Card.Subtitle>
                <Card.Text>
                  {calificacion.descripcion}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p className="text-center text-muted">
            No hay calificaciones disponibles
          </p>
        )}
      </Container>
    </div>
  );
};

export default MostrarCalificaciones;
