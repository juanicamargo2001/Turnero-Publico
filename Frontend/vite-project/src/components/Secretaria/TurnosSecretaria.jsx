import React, { useState, useEffect } from "react";
import turnosService from "../../services/turno/turnosSecretaria.service";
import misTurnosService from "../../services/turno/misTurnos.service";
import { useNavigate } from 'react-router-dom';
import { veterinarioService } from "../../services/veterinario/veterinario.service";
import medicamentosService from "../../services/medicamento/medicamentos.service";
import "./turnosSecretaria.css";

const TurnosSecretaria = () => {
  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha] = useState("");
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [medicamentoData, setMedicamentoData] = useState({
    veterinario: "",
    medicamentos: [{
      medicamento: "",
      dosis: "",
      unidadMedida: "",
      descripcion: ""
    }],
    observacion: ""
  })
  const [fallidoModal, setFallidoModal] = useState({
    show: false,
    comentario: "",
    veterinario: ""
  });

  const [medicamentoModal, setMedicamentoModal] = useState(false);
  const [veterinarios, setVeterinarios] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [dosisOptions, setDosisOptions] = useState([]);
  const [unidadMedidaOptions, setUnidadMedidaOptions] = useState([]);
  const navigate = useNavigate();

  const estadosPermitidos = {
    Reservado: ["Cancelado"],
    Confirmado: ["Ingresado", "Cancelado"],
    Ingresado: ["Realizado", "Fallido"],

    
  };

  const fetchTurnosPorFecha = async (fecha) => {
    setLoading(true);
    setError(null);
    try {
      const data = await turnosService.obtenerTurnosPorFecha(fecha);
      setTurnos(data.result);
    } catch (err) {
      setError("Error al obtener los turnos por fecha");
      setTurnos([]);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTurnosPorDni = async (dni) => {
    setLoading(true);
    setError(null);
    try {
      const data = await turnosService.obtenerTurnosPorDni(dni);
      setTurnos(data.result);
    } catch (err) {
      setError("Error al obtener los turnos por DNI");
      setTurnos([]);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    setError(null);
    if (dni) {
      if (!/^\d+$/.test(dni)) {
        setError("El DNI debe contener solo números");
        return;
      }
      await fetchTurnosPorDni(dni);
    } else if (fecha) {
      await fetchTurnosPorFecha(fecha);
    } else {
      setError("Por favor, ingresa una fecha o un DNI para buscar");
      setTurnos([]);
    }
  };

  useEffect(() => {
    const fetchVeterinarios = async () => {
      try {
        const data = await veterinarioService.BuscarTodos(); // Suponiendo que esta es la función para obtener veterinarios
        setVeterinarios(data.result);
      } catch (err) {
        console.error("Error al obtener veterinarios:", err);
      }
    };

    const fetchMedicamentos = async () => {
      try {
        const data = await medicamentosService.obtenerMedicamentos();
        setMedicamentos(data.result);
      } catch (err) {
        console.error("Error al obtener medicamentos:", err);
      }
    };

    fetchVeterinarios();
    fetchMedicamentos();
    fetchUnidades();
  }, []);

  const handleMedicamentoInput = (e) => {
    const { name, value } = e.target;
    setMedicamentoData({ ...medicamentoData, [name]: value });
  };

  const handleFallidoInput = (e) => {
    const { name, value } = e.target;
    setFallidoModal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicamentoSubmit = () => {
    if (!medicamentoData.veterinario) {
      setError("Debe seleccionar un veterinario.");
      return;
    }
  
    if (!medicamentoData.medicamentos || medicamentoData.medicamentos.length === 0) {
      setError("Debe agregar al menos un medicamento.");
      return;
    }
  
    // Validar que todos los campos de cada medicamento estén completos
    const medicamentosIncompletos = medicamentoData.medicamentos.some(med => 
      !med.medicamento || !med.dosis || !med.unidadMedida || !med.descripcion
    );
  
    if (medicamentosIncompletos) {
      setError("Todos los campos de cada medicamento son obligatorios.");
      return;
    }
  
    setError(null);
    setMedicamentoModal(false);
    setConfirmModal(true);
  };

  const handleEstadoChange = (turno, nuevoEstado) => {
    setSelectedTurno(turno);
    setNuevoEstado(nuevoEstado);

    if (nuevoEstado === "Realizado") {
      setMedicamentoModal(true); // Abrir modal para datos del medicamento
    }
    else if(nuevoEstado === "Fallido"){
      setFallidoModal({
        show: true,
        comentario: "",
        veterinario: ""
      }); // Abrir modal para datos de turno fallido
    }
    else {
      setConfirmModal(true); // Mostrar modal de confirmación
    }
  };

  const handleConfirmChange = async () => {
    setConfirmModal(false); // Cerrar modal de confirmación
    try {
      setLoading(true);
      if (nuevoEstado === "Realizado") {
        const medicaciones = medicamentoData.medicamentos.map(med => ({
          medicamento: med.medicamento,
          dosis: parseInt(med.dosis, 10),
          unidadMedida: med.unidadMedida,
          descripcion: med.descripcion
        }));
  
        await turnosService.finalizarHorario(
          selectedTurno.idHorario, 
          parseInt(medicamentoData.veterinario, 10), 
          medicaciones,
          medicamentoData.observacion
        );

      } else if (nuevoEstado === "Fallido") {
        await turnosService.marcarTurnoFallido( //Modificar esto para despues
          selectedTurno.idHorario,
          fallidoModal.comentario,
          parseInt(fallidoModal.veterinario, 10)
        );

      } else if (nuevoEstado === "Cancelado") {
        await misTurnosService.cancelarTurno(selectedTurno.idHorario);
      //} else if (nuevoEstado === "Confirmado") {
      //  await turnosService.confirmarTurno(selectedTurno.idHorario);
      } else if (nuevoEstado === "Ingresado") {
        await turnosService.confirmarIngreso(selectedTurno.idHorario);
      }

      setTurnos((prevTurnos) =>
        prevTurnos.map((t) =>
          t.idHorario === selectedTurno.idHorario
            ? { ...t, estado: nuevoEstado }
            : t
        )
      );
    } catch (err) {
      setError("Error al realizar la acción");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
    setMedicamentoModal(false);
    setFallidoModal({ show: false, comentario: "",veterinario: "" });
    setSelectedTurno(null);
    setNuevoEstado("");
    setMedicamentoData({
      veterinario: "",
      medicamentos: [{
        medicamento: "",
        dosis: "",
        unidadMedida: "",
        descripcion: ""
      }],
      observacion: ""
    });
  };

  const fetchUnidades = async () => {
    try {
      const data = await medicamentosService.obtenerUnidadesMedida();
      setUnidadMedidaOptions(data.result);
    } catch (err) {
      console.error("Error al obtener unidades de medida:", err);
    }
  }  

  return (
    <div className="contenedor mt-4 page-container">
      <h2 className="maven-pro-title">Turnos del Día</h2>
      {/* Formulario de búsqueda de turnos */}
        <form
          className="filterForm d-flex flex-column flex-md-row justify-content-center align-items-center gap-3"
          onSubmit={handleBuscar}
        >
          <div className="form-group-secretaria d-flex flex-row gap-3 align-items-center">
            <label htmlFor="fecha" className="label">
              Fecha:
            </label>
            <input
              type="date"
              id="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group-secretaria d-flex flex-row gap-3 align-items-center">
            <label htmlFor="dni" className="label">
              DNI:
            </label>
            <input
              type="text"
              id="dni"
              placeholder="Ej. 12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="obtn">
            <button
              type="button"
              className="btn btn-primary  confir w-md-auto"
              onClick={handleBuscar}
            >
              Buscar
            </button>
          </div>
        </form>

        <hr />

      {/* Tabla de turnos */}
      <div className="tableContainer">
        <table className="table maven-pro-body">
          <thead>
            <tr>
              <th>Dia</th>
              <th>Nombre y Apellido</th>
              <th>DNI</th>
              <th>Centro de Castración</th>
              <th>Telefono</th>
              <th>Tipo Animal</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Cambiar estado</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              turnos.map((turno) => {
                
                const dia = turno.dia.split("T")[0];
                const hora = turno.hora.split(":")[0];
                const minutos = turno.hora.split(":")[1];
                const nombre = turno.nombre.toUpperCase();
                const mensaje = `¡Hola, qué tal! \n\n *${nombre}*, le escribimos del *${turno.centroCastracion}*.\n\n Usted tiene un turno programado para el día *${dia}* a las *${hora}:${minutos}*.\n\nPor favor, confirme su asistencia, sino se cancelará el turno. ¡Gracias!`;
                
                
                const url = `https://wa.me/${turno.telefono}?text=${encodeURIComponent(mensaje)}`;

                return (
                <tr key={turno.idHorario}>
                  <td>{dia}</td>
                  <td className="text-uppercase">{turno.nombre} {turno.apellido}</td>
                  <td>{turno.dni}</td>
                  <td>{turno.centroCastracion}</td>
                  <td>
                    <a href={url} target="blank" rel="noopener noreferrer">{turno.telefono}</a>
                    </td>
                  <td>{turno.tipoServicio}</td>
                  <td>{hora}:{minutos}</td>
                  <td>
                    <span className={`badge ${
                      turno.estado === "Realizado" ? "bg-success" : 
                      turno.estado === "Cancelado" ? "bg-danger":
                      turno.estado === "Ingresado" ? "bg-secondary":
                      turno.estado === "Confirmado" ? "bg-info":
                      turno.estado === "Ingresado" ? "bg-dark":
                      turno.estado === "Fallido" ? "bg-warning"
                      : "bg-primary"}`}>
                      {turno.estado}
                    </span>
                  </td>
                  <td>
                    {estadosPermitidos[turno.estado]?.map((estado) => (
                      <div className="button-container d-inline" key={estado}>
                      <button
                       
                        className="btn btn-outline-primary btn-sm me-2 m-1 uniform-button "
                        onClick={() => handleEstadoChange(turno, estado)}
                      >
                        {estado}
                      </button>
                      </div>
                    ))}
                  </td>
                </tr>
              );
            })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No se encontraron turnos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de medicamento */}
      {medicamentoModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content p-4">
              <div className="modal-header">
                <h5 className="maven-pro-title">Registrar Medicamentos</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>

              <div className="maven-pro-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <div className="form-group-secretaria mb-3">
                  <label>Veterinario:</label>
                  <select
                    name="veterinario"
                    value={medicamentoData.veterinario}
                    onChange={handleMedicamentoInput}
                    className="form-control"
                  >
                    <option value="">Seleccione un veterinario</option>
                    {veterinarios.map((veterinario) => (
                      <option key={veterinario.idLegajo} value={veterinario.idLegajo}>
                        {veterinario.nombre} {veterinario.apellido} - {veterinario.dni}
                      </option>
                    ))}
                  </select>
                </div>

                {medicamentoData.medicamentos?.map((med, index) => (
                  <div key={index} className="medicamento-item mb-3 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6>Medicamento #{index + 1}</h6>
                      <button 
                        type="button" 
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          const updatedMedicamentos = [...medicamentoData.medicamentos];
                          updatedMedicamentos.splice(index, 1);
                          setMedicamentoData({
                            ...medicamentoData,
                            medicamentos: updatedMedicamentos
                          });
                        }}
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="form-group-secretaria mb-2">
                      <label>Medicamento:</label>
                      <select
                        name="medicamento"
                        value={med.medicamento}
                        onChange={(e) => {
                          const updatedMedicamentos = [...medicamentoData.medicamentos];
                          updatedMedicamentos[index].medicamento = e.target.value;
                          setMedicamentoData({
                            ...medicamentoData,
                            medicamentos: updatedMedicamentos
                          });
                        }}
                        className="form-control"
                      >
                        <option value="">Seleccione un medicamento</option>
                        {medicamentos.map((medicamento) => (
                          <option key={medicamento.id} value={medicamento.id}>
                            {medicamento.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group-secretaria mb-2">
                      <label>Dosis:</label>
                      <input
                        type="number"
                        name="dosis"
                        value={med.dosis}
                        onChange={(e) => {
                          const updatedMedicamentos = [...medicamentoData.medicamentos];
                          updatedMedicamentos[index].dosis = e.target.value;
                          setMedicamentoData({
                            ...medicamentoData,
                            medicamentos: updatedMedicamentos
                          });
                        }}
                        className="form-control"
                        min="1"
                        step="1"
                        placeholder="Escriba la dosis necesaria"
                      />
                    </div>

                    <div className="form-group-secretaria mb-2">
                      <label>Unidad de Medida:</label>
                      <select
                        name="unidadMedida"
                        value={med.unidadMedida}
                        onChange={(e) => {
                          const updatedMedicamentos = [...medicamentoData.medicamentos];
                          updatedMedicamentos[index].unidadMedida = e.target.value;
                          setMedicamentoData({
                            ...medicamentoData,
                            medicamentos: updatedMedicamentos
                          });
                        }}
                        className="form-control"
                      >
                        <option value="">Seleccione unidad</option>
                        {unidadMedidaOptions.map((unidad) => (
                          <option key={unidad.idUnidad} value={unidad.tipoUnidad}>
                            {unidad.tipoUnidad}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group-secretaria mb-2">
                      <label>Descripción:</label>
                      <input
                        type="text"
                        name="descripcion"
                        value={med.descripcion}
                        onChange={(e) => {
                          const updatedMedicamentos = [...medicamentoData.medicamentos];
                          updatedMedicamentos[index].descripcion = e.target.value;
                          setMedicamentoData({
                            ...medicamentoData,
                            medicamentos: updatedMedicamentos
                          });
                        }}
                        className="form-control"
                        placeholder="Descripción del medicamento"
                      />
                    </div>
                  </div>
                  
                ))}

                <div className="d-flex justify-content-between mt-3">
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => {
                      setMedicamentoData({
                        ...medicamentoData,
                        medicamentos: [
                          ...(medicamentoData.medicamentos || []),
                          {
                            medicamento: "",
                            dosis: "",
                            unidadMedida: "",
                            descripcion: "",
                            observacion: "",
                          }
                        ]
                      });
                    }}
                  >
                    Agregar otro medicamento
                  </button>
                </div>

                <div className="form-group-secretaria mb-3 mt-3">
                  <label>Observación:</label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={medicamentoData.observacion}
                    onChange={handleFallidoInput}
                    placeholder="Ingrese la observación del Turno."
                  ></textarea>
                </div>

                
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleMedicamentoSubmit}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmación */}
      {confirmModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content p-4">
              <div className="modal-header">
                <h5 className="maven-pro-title">Confirmación de Acción</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}>
                  
                </button>
              </div>
              <div className="maven-pro-body p-4">
                ¿Está seguro de que desea cambiar el estado del turno?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleConfirmChange}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de turno fallido */}
      {fallidoModal.show && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content p-4">
              <div className="modal-header">
                <h5 className="maven-pro-title">Registrar Turno Fallido</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close" 
                  onClick={() => setFallidoModal({ show: false, comentario: "" })}
                ></button>
              </div>

              <div className="form-group-secretaria mb-3">
                  <label>Veterinario:</label>
                  <select
                    name="veterinario"
                    value={fallidoModal.veterinario}
                    onChange={handleFallidoInput}
                    className="form-control"
                  >
                    <option value="">Seleccione un veterinario</option>
                    {veterinarios.map((veterinario) => (
                      <option key={veterinario.idLegajo} value={veterinario.idLegajo}>
                        {veterinario.nombre} {veterinario.apellido} - {veterinario.dni}
                      </option>
                    ))}
                  </select>
                </div>

              <div className="maven-pro-body">
                <div className="form-group-secretaria mb-3">
                  <label>Comentario:</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={fallidoModal.comentario}
                    onChange={handleFallidoInput}
                    placeholder="Ingrese el inconveniente del turno."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setFallidoModal({ show: false, comentario: "", veterinario: "" })}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    if (!fallidoModal.comentario.trim()) {
                      setError("Por favor ingrese un comentario");
                      return;
                    }
                    setError(null);
                    setConfirmModal(true);
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    <div className="d-flex buttons-footer justify-content-center">
        <button type="button" onClick={() => navigate("/secretaria/turno-urgencia")} className="btn btn-success confir3 m-3">Registrar Turno Urgencia</button>
        <button type="button" onClick={()=> navigate("/asignar/turno")} className="btn btn-success confir3 m-3" >Registrar Turno Telefono</button>
      </div>
    </div>

  );
};

export default TurnosSecretaria;
