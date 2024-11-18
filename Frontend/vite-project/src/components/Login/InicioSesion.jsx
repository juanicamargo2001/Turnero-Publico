import React, { useState } from 'react';
import './InicioSesion.css';
import loginService from '../../services/login.service';
import loginImage from '../../imgs/inicio.jpeg';

const LoginComponent = () => {
  const [email, setEmail] = useState(''); // Cambiado de dni a email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, ingrese su email y contraseña.');
      return;
    }

    try {
      const response = await loginService.login(email, password);
      if (response.success) {
        alert('Inicio de sesión exitoso');
        console.log('Inicio de sesión exitoso:', response);
      } else {
        setError('Error de autenticación');
      }
    } catch (error) {
      setError('Error de autenticación');
      console.error('Error:', error);
    }

    console.log('Email:', email, 'Password:', password);
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
          <form className="login-form" onSubmit={handleSubmit}>
            <h3>Iniciar Sesión</h3>

            <div className="form-group">
              <input
                type="email"
                className="custom-input"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                className="custom-input"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button type="submit">Ingresar</button>

            {error && <p className="error-message">{error}</p>}

            <div className="register-link">
              ¿Aún no estás registrado? <a href="/registrar/vecino">Crea una cuenta</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
