import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";
import {veterinarioService} from "../../services/veterinario.service";

const RegistroVeterinario = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [dni, setDNI] = useState('');
  const [email, setEmail] = useState('');
  const [fecha, setFecha] = useState('');
  const [legajo, setLegajo] = useState('');
  const [matricula, setMatricula] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const nuevoVeterinario = { 
      legajo,
      matricula,
      nombre,
      //apellido,
      telefono,
      habilitado: true,
      fecha,
      domicilio,
      dni, 
      email 
    };
  
    try {
      await veterinarioService.Grabar(nuevoVeterinario);
      alert("Mascota registrada con éxito");
      // Limpiar el formulario
      setNombre('');
      setApellido('');
      setDomicilio('');
      setDNI('');
      setEmail('');
      setFecha('');
      setLegajo('');
      setMatricula('');
      setTelefono('');
    } catch (error) {
      console.error("Error al registrar el veterinario:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">REGISTRO DE VETERINARIO</h2>
      <form onSubmit={handleSubmit} className="maven-pro-body">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre *</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Escriba su nombre "
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">Apellido *</label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            placeholder="Escriba su apellido "
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email *</label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Escriba su email "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="domicilio" className="form-label">Domicilio *</label>
          <input
            type="text"
            className="form-control"
            id="domicilio"
            placeholder="Escriba su domicilio "
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="legajo" className="form-label">Legajo *</label>
          <input
            type="number"
            className="form-control"
            id="legajo"
            placeholder="Escriba su legajo "
            value={legajo}
            onChange={(e) => setLegajo(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="matricula" className="form-label">Matricula *</label>
          <input
            type="number"
            className="form-control"
            id="matricula"
            placeholder="Escriba su matricula "
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Telefono *</label>
          <input
            type="number"
            className="form-control"
            id="telefono"
            placeholder="Escriba su telefono "
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="dni" className="form-label">DNI *</label>
          <input
            type="number"
            className="form-control"
            id="dni"
            placeholder="Escriba su dni "
            value={dni}
            onChange={(e) => setDNI(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">Fecha de nacimiento *</label>
          <Flatpickr
            value={fecha}
            onChange={(date) => setFecha(date)}
            options={{ 
              altInput: true,
              altFormat: "F j, Y",
              dateFormat: "d-m-Y",
              locale: Spanish,
            }}
            className="form-control"
            placeholder="Seleccione su fecha de nacimiento"
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroVeterinario;
