import React, { useState } from 'react';
import './InicioSesion.css';
import loginImage from '../../imgs/inicio.jpeg';

const LoginComponent = () => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleDniChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setDni(value);
      setError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!dni || !password) {
      setError('Por favor, ingrese su DNI y contraseña.');
      return;
    }

    console.log('DNI:', dni, 'Password:', password);
  };

  return (
    <div className="login-wrapper maven-pro-body">
      <div className="login-container">
        
        {/* Sección de la Imagen y el Mensaje de Bienvenida */}
        <div className="login-image">
          <div className="welcome-text">
            <h2 className='maven-pro-title2'>¡Bienvenido al Turnero de Castración de Mascotas!</h2>
            <p>Acceda a su cuenta para gestionar turnos de castración en los centros municipales de Biocórdoba. </p>
          </div>
        </div>

        {/* Sección del Formulario de Inicio de Sesión */}
        <div className="login-box">
          <form className="login-form">
            <h3>Iniciar Sesión</h3>

            <div className="form-group">
              <input type="text" className="custom-input" placeholder="DNI" required />
            </div>

            <div className="form-group">
              <input type="password" className="custom-input" placeholder="Contraseña" required />
            </div>


            <button type="submit">Ingresar</button>

            <div className="register-link">
            ¿Aún no estás registrado? <a href="#register">Crea una cuenta</a>
            </div>
          </form>
        </div>

      </div>
    </div>
  );

};

export default LoginComponent;
