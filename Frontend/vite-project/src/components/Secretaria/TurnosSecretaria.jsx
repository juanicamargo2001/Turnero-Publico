import React, { useState } from "react";
import turnosService from "../../services/turnosSecretaria.service";
import misTurnosService from "../../services/misTurnos.service";

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

  const estadosPermitidos = {
    Reservado: ["Confirmado", "Cancelado"],
    Confirmado: ["Ingresado"],
    Ingresado: ["Realizado"],
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

  const handleEstadoChange = async (turno, nuevoEstado) => {
    if (nuevoEstado === "Cancelado") {
      try {
        setLoading(true);
        await misTurnosService.cancelarTurno(turno.idHorario);
        setTurnos((prevTurnos) =>
          prevTurnos.map((t) =>
            t.idHorario === turno.idHorario ? { ...t, estado: "Cancelado" } : t
          )
        );
        console.log(`Turno con ID ${turno.idHorario} cancelado exitosamente.`);
      } catch (err) {
        setError("Error al cancelar el turno");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    } else {
      setSelectedTurno(turno);
      setNuevoEstado(nuevoEstado);
      setConfirmModal(true);
    }
  };

  const handleConfirmChange = async () => {
    try {
      await turnosService.cambiarEstado(selectedTurno.id, nuevoEstado);
      setTurnos((prevTurnos) =>
        prevTurnos.map((turno) =>
          turno.id === selectedTurno.id ? { ...turno, estado: nuevoEstado } : turno
        )
      );
      setConfirmModal(false);
      setSelectedTurno(null);
      setNuevoEstado("");
    } catch (err) {
      setError("Error al cambiar el estado del turno");
      console.error("Error:", err);
    }
  };

  const handleCloseModal = () => {
    setConfirmModal(false);
    setSelectedTurno(null);
    setNuevoEstado("");
  };

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">Turnos del Día</h2>
      <form
        className="filterForm d-flex justify-content-center align-items-center gap-3"
        onSubmit={handleBuscar}
      >
        <label htmlFor="fecha" className="label">
          Fecha:
        </label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="form-control w-25"
        />
        <label htmlFor="dni" className="label">
          DNI:
        </label>
        <input
          type="text"
          id="dni"
          placeholder="Ej. 12345678"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="form-control w-25"
        />
        <div className="obtn">
          <button type="button" className="btn btn-primary obtenerTurno" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </form>
      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error text-danger">{error}</p>}
      <div className="tableContainer">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nombre y apellido</th>
              <th>DNI</th>
              <th>Tipo Animal</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Cambiar estado</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.idHorario}>
                  <td className="text-uppercase">
                    {turno.nombre} {turno.apellido}
                  </td>
                  <td>{turno.dni}</td>
                  <td>{turno.tipoServicio}</td>
                  <td>{turno.hora}</td>
                  <td>
                    <span
                      className={`badge ${
                        turno.estado === "Pendiente"
                          ? "bg-success"
                          : turno.estado === "Cancelado"
                          ? "bg-danger"
                          : "bg-primary"
                      }`}
                    >
                      {turno.estado}
                    </span>
                  </td>
                  <td>
                    {estadosPermitidos[turno.estado]?.map((estado) => (
                      <button
                        key={estado}
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleEstadoChange(turno, estado)}
                      >
                        {estado}
                      </button>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No se encontraron turnos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirmModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar cambio de estado</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  ¿Estás seguro de que deseas cambiar el estado del turno de {selectedTurno.nombre} {selectedTurno.apellido} a "{nuevoEstado}"?
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleConfirmChange}>
                  Continuar
                </button>
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TurnosSecretaria;
