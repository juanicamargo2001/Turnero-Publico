import { useState, useEffect } from "react";
import { agendaService } from "../../services/agenda/habilitar.service";
import { centroService } from "../../services/centro/centro.service";
import { DotLoader } from "react-spinners";
import Swal from "sweetalert2";

const EliminarAgenda = () => {
  const [agendasCentro, setAgendasCentro] = useState([]);
  const [centrosCastracion, setCentrosCastracion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
	const [mensaje, setMensaje] = useState("");

  const fetchAgendas = async (idCentro) => {
    setIsLoading(true);
    let response = await agendaService.ConsultarAgendasXCentro(idCentro);

    if (response != null) {
      setAgendasCentro(response.result);
      setIsLoading(false);
			setMensaje("");
			
    } else {
      setAgendasCentro([]);
      setIsLoading(false);
			setMensaje("No se encontraron agendas para este centro de castración.")
		}
  };

  const eliminarAgendaXCentro = async (idAgenda) => {
    Swal.fire({
      title: "¿Está seguro/a de que desea eliminar la agenda?",
      text: "No podrá ser revertida la acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#60C1EA",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {

        let eliminado = await agendaService.EliminarAgenda(idAgenda);

        if (eliminado) {
          Swal.fire({
            title: "¡Éxito!",
            text: "Agenda eliminada con éxito.",
            icon: "success",
            confirmButtonColor: "#E15562",
            confirmButtonText: "OK",
          }).then(window.location.reload());
        } else {
          Swal.fire({
            title: "Error!",
            text: "Sucedió un error inesperado",
            icon: "error",
            confirmButtonColor: "#E15562",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCentros = async () => {
      let response = await centroService.BuscarTodos();

      if (response.result != null && response.result.length > 0) {
				let centrosHabilitados = response.result.filter(e => e.habilitado === true)
        setCentrosCastracion(centrosHabilitados);
        setIsLoading(false);
      } else {
        setCentrosCastracion([]);
        setIsLoading(false);
      }
    };

    fetchCentros();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <DotLoader color="#60C1EA" />
        </div>
      )}
      <div className="container mt-4">
        <h2 className="maven-pro-title text-center mb-4">Eliminar Agenda</h2>
        <div className="mb-3">
          <label htmlFor="idCentroCastracion" className="form-label" style={{fontSize: "1rem"}}>
            Centro de Castración
          </label>
          <select className="form-select" onChange={(e) => fetchAgendas(e.target.value)}>
            <option value="">Seleccione un centro</option>
            {centrosCastracion.map((centro) => (
              <option
                key={centro.id_centro_castracion}
                value={centro.id_centro_castracion}
              >
                {centro.nombre}
              </option>
            ))}
          </select>

          {agendasCentro.length > 0 ? (
            agendasCentro.map((agenda, index) => (
              <div key={index} className="col-md-12 p-4">
                <div className="shadow-sm border p-5 rounded">
                  <div className="d-flex justify-content-between">
                    <div style={{ paddingLeft: "15px" }}>
                      <h5>{`Agenda`}</h5>
                      <p>
                        <strong>Fecha Inicio: </strong>{" "}
                        {new Date(agenda.fecha_inicio).toLocaleDateString() ||
                          "No disponible"}{" "}
                        <br />
                        <strong>Fecha Fin: </strong>{" "}
                        {new Date(agenda.fecha_fin).toLocaleDateString() ||
                          "No disponible"}{" "}
                        <br />
                        <strong>Cantidad de turnos de gatos: </strong>{" "}
                        {agenda.cantidadTurnosGatos || "No especificado"} <br />
                        <strong>Cantidad de turnos de perros: </strong>{" "}
                        {agenda.cantidadTurnosPerros || "No especificado"}{" "}
                        <br />
                      </p>
                    </div>
                    <div className="d-flex flex-column align-items-start">
                      <button
                        className="btn btn-danger"
                        onClick={() => eliminarAgendaXCentro(agenda.idAgenda)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center mt-5">
							<h5>{mensaje}</h5>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EliminarAgenda;
