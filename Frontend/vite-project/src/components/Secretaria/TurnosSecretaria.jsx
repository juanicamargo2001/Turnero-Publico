import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loginService from '../../services/login.service';

const TurnosSecretaria = () => {
  const [turnos, setTurnos] = useState([]);
  const [fecha, setFecha] = useState('');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Obtén el token de la secretaria logueada
    const userToken = loginService.obtenerToken();
    if (userToken) {
      setToken(userToken);
      console.log('El token se guardó correctamente:', userToken);
    } else {
      console.log('No se encontró ningún token en el localStorage.');
    }
  }, []);

  // Configuración de Axios (espera a que el token esté listo)
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Función para obtener turnos por fecha
  const fetchTurnosPorFecha = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        '/api/Turnos/turnosFiltro',
        {
          fechaDesde: fecha,
          fechaHasta: fecha,
          horaDesde: { hours: 0, minutes: 0, seconds: 0 },
          horaHasta: { hours: 23, minutes: 59, seconds: 59 },
        },
        axiosConfig
      );
      setTurnos(response.data);
    } catch (err) {
      setError('Error al obtener los turnos por fecha');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener turnos por DNI
  const fetchTurnosPorDni = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        '/api/Turnos/filtroPorDni',
        { dni: parseInt(dni, 10) },
        axiosConfig
      );
      setTurnos(response.data);
    } catch (err) {
      setError('Error al obtener los turnos por DNI');
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el filtro de búsqueda
  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Token no disponible. Intenta recargar la página.');
      return;
    }

    if (dni) {
      if (!/^\d+$/.test(dni)) {
        setError('El DNI debe contener solo números');
        return;
      }
      await fetchTurnosPorDni();
    } else if (fecha) {
      await fetchTurnosPorFecha();
    } else {
      setError('Por favor, ingresa una fecha o un DNI para buscar');
    }
  };

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

        <label htmlFor="dni" style={styles.label}>
          DNI:
        </label>
        <input
          type="text"
          id="dni"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Ej. 12345678"
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

// Estilos (sin cambios)
const styles = {
  turnosContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  title: {
    color: '#0095d9',
    marginBottom: '20px',
    textAlign: 'center',
  },
  filterForm: {
    display: 'flex',
    flexWrap: 'wrap',
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
    backgroundColor: '#0095d9',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  tableWrapper: {
    overflowX: 'auto',
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
    backgroundColor: '#eaf6fc',
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
