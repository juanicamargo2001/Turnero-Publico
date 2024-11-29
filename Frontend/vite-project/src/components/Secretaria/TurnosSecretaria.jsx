import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TurnosSecretaria = () => {
  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTurnos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/Turnos/turnosFiltro', {
        fechaDesde: fecha,
        fechaHasta: fecha,
        horaDesde: { hours: 0, minutes: 0, seconds: 0 },
        horaHasta: { hours: 23, minutes: 59, seconds: 59 },
        idCentroCastracion: 1,
      });
      setTurnos(response.data);
    } catch (error) {
      setError('Error al obtener los turnos');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    fetchTurnos();
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  return (
    <div style={styles.turnosContainer}>
      <h1 style={styles.title}>Turnos del Día</h1>
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

        <label htmlFor="hora" style={styles.label}>
          Hora:
        </label>
        <input
          type="time"
          id="hora"
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Buscar
        </button>
      </form>

      {loading && <p style={styles.loading}>Cargando turnos...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Tipo Animal</th>
              <th style={styles.th}>Sexo</th>
              <th style={styles.th}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno, index) => (
              <tr key={index} style={styles.tr}>
                <td style={styles.td}>{turno.nombre || 'Sin nombre'}</td>
                <td style={styles.td}>{turno.tipoAnimal || 'Desconocido'}</td>
                <td style={styles.td}>{turno.sexo || 'N/A'}</td>
                <td
                  style={{
                    ...styles.td,
                    ...styles.estado,
                    color: turno.estado?.toLowerCase() === 'pendiente' ? '#28a745' : '#dc3545',
                  }}
                >
                  {turno.estado || 'Pendiente'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Estilos en línea
const styles = {
  turnosContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    color: '#0095d9', // Celeste
    marginBottom: '20px',
    textAlign: 'center',
  },
  filterForm: {
    display: 'flex',
    flexWrap: 'wrap', // Para apilar en pantallas pequeñas
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  label: {
    fontWeight: 'bold',
    marginRight: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    minWidth: '150px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: '#0095d9', // Celeste
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#007bb5',
  },
  tableWrapper: {
    overflowX: 'auto', // Habilita scroll horizontal en pantallas pequeñas
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#eaf6fc', // Celeste claro
    color: '#0095d9',
  },
  td: {
    border: '1px solid #ddd',
    padding: '10px',
    textAlign: 'left',
  },
  tr: {
    backgroundColor: '#f2f2f2',
  },
  estado: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loading: {
    color: '#0095d9',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default TurnosSecretaria;