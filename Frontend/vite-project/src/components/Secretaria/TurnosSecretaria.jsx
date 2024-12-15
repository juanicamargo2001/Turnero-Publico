import React, { useState } from "react";
import turnosService from "../../services/turnosSecretaria.service";
import { useNavigate } from 'react-router-dom';

const TurnosSecretaria = () => {
  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha] = useState("");
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  // Función para obtener turnos por fecha
  const fetchTurnosPorFecha = async (fecha) => {
    setLoading(true);
    setError(null);
    try {
      const data = await turnosService.obtenerTurnosPorFecha(fecha);
      setTurnos(data.result);
      //console.log(data.result);
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
      console.log(data.result);
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
    console.log("Buscar por fecha:", fecha);
    if (dni) {
      if (!/^\d+$/.test(dni)) {
        setError("El DNI debe contener solo números");
        return;
      }
      await fetchTurnosPorDni(dni);
    } else if (fecha) {
      await fetchTurnosPorFecha(fecha);
      console.log("Turnos:", turnos);
    } else {
      setError("Por favor, ingresa una fecha o un DNI para buscar");
      setTurnos([]);
    }
  };

  return (
    <div style={styles.turnosContainer}>
      <h1 style={styles.title}>Turnos del Día</h1>
      {/* Formulario para buscar por Fecha o DNI */}
      <form style={styles.filterForm} onSubmit={handleBuscar}>
        <label htmlFor="fecha" style={styles.label}>
          Fecha:
        </label>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={styles.input}
        />
        <label htmlFor="dni" style={styles.label}>
          DNI:
        </label>
        <input
          type="text"
          id="dni"
          placeholder="Ej. 12345678"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Buscar
        </button>
      </form>

      {/* Mostrar mensajes de carga o error */}
      {loading && <p style={styles.loading}>Cargando...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {/* Mostrar tabla de turnos */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nombre</th>
              <th style={styles.tableHeader}>DNI</th>
              <th style={styles.tableHeader}>Tipo Animal</th>
              <th style={styles.tableHeader}>Hora</th>
              <th style={styles.tableHeader}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {turnos.length > 0 ? (
              turnos.map((turno) => (
                <tr key={turno.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{turno.nombre} {turno.apellido}</td>
                  <td style={styles.tableCell}>{turno.dni}</td>
                  <td style={styles.tableCell}>{turno.tipoServicio}</td>
                  <td style={styles.tableCell}>{turno.hora}</td>
                  <td style={styles.tableCell}>
                    <span
                      style={{
                        ...styles.estado,
                        backgroundColor:
                          turno.estado === "Pendiente"
                            ? "#28a745"
                            : "#dc3545",
                      }}
                    >
                      {turno.estado}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={styles.noResults}>
                  No se encontraron turnos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <button type="button" onClick={() => navigate("/secretaria/turno-urgencia")} className="btn btn-success confir3">Registrar Turno Urgencia</button>
        <button type="button" onClick={()=> navigate("/secretaria/turno-telfono")} className="btn btn-success confir3" >Registrar Turno Telefono</button>
      </div>
    </div>
  );
};

const styles = {
  turnosContainer: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    color: "#007BFF",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  filterForm: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    width: "150px",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },
  tableContainer: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  tableHeader: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "10px",
    fontWeight: "bold",
    fontSize: "16px",
  },
  tableRow: {
    borderBottom: "1px solid #ddd",
  },
  tableCell: {
    padding: "10px",
    fontSize: "14px",
  },
  estado: {
    color: "#fff",
    padding: "5px 10px",
    borderRadius: "5px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    color: "#007BFF",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontWeight: "bold",
  },
  noResults: {
    padding: "10px",
    fontSize: "16px",
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
  },
};

export default TurnosSecretaria;