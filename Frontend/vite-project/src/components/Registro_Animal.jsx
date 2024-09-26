import React, { useState } from 'react';

const RegistroAnimal = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [tamano, setTamano] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ nombre, descripcion, edad, sexo, tamano });
  };

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">INGRESAR DATOS DE ANIMAL</h2>
      <form onSubmit={handleSubmit} className="maven-pro-body">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Escriba el nombre del animal (opcional)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            rows="4"
            placeholder="Escriba una descripción (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            id="edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            required
          >
            <option value="" disabled>Seleccionar edad aproximada</option>
          </select>
        </div>
       <div className="mb-3">
          <select
            className="form-select"
            id="sexo"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            required
          >
            <option value="" disabled>Seleccionar Tipo de animal</option>
          </select>
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            id="sexo"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            required
          >
            <option value="" disabled>Seleccionar sexo</option>
          </select>
        </div>
        <div className="mb-3">

          <select
            className="form-select"
            id="tamano"
            value={tamano}
            onChange={(e) => setTamano(e.target.value)}
            required
          >
            <option value="" disabled>Seleccionar tamaño</option>
          </select>
        </div>
        <div className="d-flex justify-content-between">
        {/* Otros elementos si los hay */}
        <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>

      </form>
    </div>
  );
};

export default RegistroAnimal;
