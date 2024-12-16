import React, { useState } from "react";
import turnosService from "../../services/turnosSecretaria.service";
import { useNavigate } from 'react-router-dom';

const TurnosSecretaria = () => {
  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha] = useState("");
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState(null);
  const navigate = useNavigate()

  // Función para obtener turnos por fecha
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

  // Función para obtener turnos por DNI
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

  // Manejo del filtro de búsqueda
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

  // Manejar clic en "Finalizar"
  const handleView = (turno) => {
    setSelectedTurno(turno);
    setShowModal(true);
  };

  // Manejar cierre del modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTurno(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">Turnos del Día</h2>
      {/* Formulario para buscar por Fecha o DNI */}
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

        <hr />

        <div className="obtn">
          <button
            type="button"
            className="btn btn-primary obtenerTurno"
            onClick={(e) => handleBuscar(e)}
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Mostrar mensajes de carga o error */}
      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error text-danger">{error}</p>}

      {/* Mostrar tabla de turnos */}
      <div className="tableContainer">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Nombre y apellido</th>
              <th>DNI</th>
              <th>Tipo Animal</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Finalizar</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.id}>
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
                          : "bg-danger"
                      }`}
                    >
                      {turno.estado}
                    </span>
                  </td>
                  <td>
                    <a
                      href="#"
                      onClick={() => handleView(turno)}
                      className="btn btn-separator"
                    >
                      <i
                        title="Finalizar"
                        className="fa fa-edit"
                        aria-hidden="true"
                      ></i>
                    </a>
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

      {/* Modal para finalizar turno */}
      {showModal && selectedTurno && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Finalizar turno de {selectedTurno.nombre} {selectedTurno.apellido}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Medicamento</label>
                  <select className="form-control">
                    <option>Seleccionar</option>
                    <option>Medicamento 1</option>
                    <option>Medicamento 2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Dosis</label>
                  <select className="form-control">
                    <option>Seleccionar</option>
                    <option>Dosis 1</option>
                    <option>Dosis 2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Veterinario</label>
                  <select className="form-control">
                    <option>Seleccionar</option>
                    <option>Veterinario 1</option>
                    <option>Veterinario 2</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => alert("Turno finalizado")}
                >
                  Finalizar
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <button type="button" onClick={() => navigate("/secretaria/turno-urgencia")} className="btn btn-success confir3">Registrar Turno Urgencia</button>
        <button type="button" onClick={()=> navigate("/secretaria/turno-telfono")} className="btn btn-success confir3" >Registrar Turno Telefono</button>
      </div>
    </div>
  );
};

export default TurnosSecretaria;
