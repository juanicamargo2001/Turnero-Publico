import React, { useState } from "react";
import { turnosService } from "../../services/turnosVecino.service";
import { useNavigate } from "react-router-dom";

function BuscarTurnosPorDni() {
  const [dni, setDni] = useState("");
  const [resultado, setResultado] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleBuscar = async () => {
    try {
      const dniNumber = parseInt(dni);
      if (isNaN(dniNumber)) {
        throw new Error("El DNI no es válido. Por favor ingresa un número válido.");
      }

      console.log("DNI ingresado:", dniNumber);

      const respuesta = await turnosService.filtrarPorDni(dniNumber);
      console.log("Respuesta de la API:", respuesta);

      setResultado(respuesta.result);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al buscar turnos. Intenta de nuevo.");
    }
  };
  const handleContinuar = () => {
    if (resultado.length > 0) {
      navigate("/centros", {
        state: {
          idUsuario: resultado[0].idUsuario,
          dni: resultado[0].dni,
        },
      });
    } else {
      setError("No se puede continuar sin resultados de búsqueda.");
    }
  };


  return (
    <div className="container mt-5 maven-pro-body">
      <h1 className="mb-4 maven-pro-title">Registrar turno</h1>

      <div className="row align-items-center mb-3">
        <div className="col-auto">
          <span>Numero de documento:</span>
        </div>
        <div className="col-6">
          <input
            type="text"
            id="dniInput"
            className="form-control"
            placeholder="Ej: 94340042"
            value={dni}
            onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary confir" onClick={handleBuscar}>
            Buscar
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {resultado.length > 0 && (
        <>
        <div className="card p-3 mb-4">
            <h5>{`${resultado[0].apellido}, ${resultado[0].nombre}`}</h5>
            <div className="d-flex justify-content">
                <p>DNI: {resultado[0].dni} </p>
                <p>Teléfono: {resultado[0].telefono}</p>
            </div>
        </div>

        <h4 className="mt-4">Historial</h4>

        <table className="table table-bordered">
        <thead>
            <tr>
            <th>Centro de Castración</th>
            <th>Tipo de Servicio</th> 
            <th>Día</th>
            <th>Hora</th>
            <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            {resultado.map((turno, index) => (
            <tr key={index}>
                <td>{turno.centroCastracion}</td>
                <td>{turno.tipoServicio}</td>
                <td>{new Date(turno.dia).toLocaleDateString()}</td>
                <td>{turno.hora}</td>
                <td>{turno.estado}</td>
            </tr>
            ))}
        </tbody>
        </table>
        <p className="mt-4">ID Usuario: {resultado[0].idUsuario}</p>
        <div className="d-flex justify-content-between">
      <button
        type="submit"
        className="btn btn-primary ms-auto confir"
        onClick={handleContinuar}
      >
        Confirmar
      </button>
    </div>

    </>
    )}

    </div>
  );
}

export default BuscarTurnosPorDni;
