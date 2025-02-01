import React from 'react';

export default function Informacion_VxC({ veterinarios, nombreCentro }) {
  return (
    <div className="veterinarios-info mt-3">
      <h5>Veterinarios del centro {nombreCentro}:</h5>
      {veterinarios.length > 0 ? (
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Legajo</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Habilitado</th>
              <th>Telefono</th>
            </tr>
          </thead>
          <tbody>
            {veterinarios.map((vet, index) => (
              <tr key={index}>
                <td>{vet.idLegajo}</td>
                <td>{vet.nombre}</td>
                <td>{vet.apellido}</td>
                <td>{vet.dni}</td>
                <td>{vet.email}</td>
                <td>{vet.habilitado ? 
                                <span style={{ color: '#00FF00' }}>✓</span> : 
                                <span style={{ color: '#FF0000' }}>✗</span>}
                </td>
                <td>{vet.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay veterinarios disponibles</p>
      )}
    </div>
  );
}
