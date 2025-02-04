import React, { useState } from "react";
import { turnosService } from "../../services/turno/turnosVecino.service";
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
    <div className="container mt-5 maven-pro-body page-container ">
      <h2 className="mb-4 maven-pro-title">Registrar turno telefonico</h2>

      <div className="row align-items-center mb-3">
        <div className="col-auto">
          <span>Numero de documento:</span>
        </div>
        <div className="col-6">
          <input
            type="text"
            id="dniInput"
            className="form-control"
            placeholder="Ej: 41250045"
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
                <p style={{paddingLeft: "10px"}}>Teléfono: {resultado[0].telefono}</p>
            </div>
        </div>

        <h4 className="mt-4">Historial</h4>

        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md bg-white">
          <thead>
            <tr className="bg-blue-600">
              <th className="p-3 text-left">Centro de Castración</th>
              <th className="p-3 text-left">Tipo de Servicio</th>
              <th className="p-3 text-left">Día</th>
              <th className="p-3 text-left">Hora</th>
              <th className="p-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody>
            {resultado.map((turno, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-100 transition duration-300"
              >
                <td className="p-3">{turno.centroCastracion}</td>
                <td className="p-3">{turno.tipoServicio}</td>
                <td className="p-3">{new Date(turno.dia).toLocaleDateString()}</td>
                <td className="p-3">{turno.hora}</td>
                <td
                  className="p-3 font-semibold"
                >
                  {turno.estado}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
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
