import React, { useState } from 'react';
import './InicioSesion.css';
import loginImage from '../../imgs/inicio.jpeg'; // Ruta de la imagen

const LoginComponent = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para el mensaje de error

  const handleDniChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Solo permite números
      setDni(value);
      setError(''); // Limpia el mensaje de error al cambiar el DNI
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(''); // Limpia el mensaje de error al cambiar la contraseña
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!dni || !password) {
      setError('Por favor, ingrese su DNI y contraseña.');
      return;
    }

    // Lógica para manejar el envío de datos
    console.log('DNI:', dni, 'Password:', password);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        {/* Contenedor de la imagen y texto de bienvenida */}
        <div className="login-image">
          <div className="welcome-text">
            <h2>Bienvenido al Turnero de Castración de Mascotas</h2>
            <p>
              Acceda a su cuenta para gestionar turnos de castración en los centros municipales de Biocórdoba. 
              Este sistema le permitirá reservar y confirmar turnos, recibir recordatorios, y consultar el 
              historial de atención para su mascota.
            </p>
          </div>
          <img src={loginImage} alt="Dog and Cat" />
        </div>

        {/* Contenedor del formulario */}
        <div className="login-box">
          <form className="login-form" onSubmit={handleSubmit}>
            <h3>Inicia sesión</h3>
            <label htmlFor="dni">DNI</label>
            <input 
              type="text" 
              id="dni" 
              value={dni} 
              onChange={handleDniChange} 
              placeholder="Ingrese número de documento" 
              pattern="\d*" // Asegura que el valor sea numérico en dispositivos móviles
              inputMode="numeric" // Ayuda a mostrar solo el teclado numérico en dispositivos móviles
            />
            
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={handlePasswordChange} 
              placeholder="Contraseña" 
            />

            {/* Mostrar mensaje de error si los campos están vacíos */}
            {error && <p className="error-message">{error}</p>}

            <button type="submit" disabled={!dni || !password}>Ingresar</button>
          </form>
          <p className="register-link">
            ¿Aún no estás registrado? <a href="/register">Crea una cuenta</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
