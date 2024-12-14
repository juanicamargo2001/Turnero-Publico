import React, { useState, useContext } from 'react';
import './InicioSesion.css';
import loginService from '../../services/login.service';
import loginImage from '../../imgs/inicio.jpeg';
import bienestarImage from '../../imgs/bienestar.png';
import UserRoleContext from './UserRoleContext';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { userRole, setUserRole } = useContext(UserRoleContext);
  const navigate = useNavigate();

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
        // alert('Inicio de sesión exitoso');
        try {
          const rol = await loginService.userRol();
          const resNom = await loginService.userName();
          setUserRole({rol:rol, nombre:resNom.nombre});
        } catch (error){
          console.log(error);
        }
      } else {
        alert('Error al verificar permisos');
        setError('Error al verificar permisos');
        return;
      }
    } catch (error) {
      alert('Error de autenticación');
      setError('Error de autenticación');
      console.error('Error:', error);
      return;
    }

    navigate("/turno");
  };

  return (
    <div className="login-wrapper maven-pro-body">
      <div className="login-container">
        <div className="login-image">
          <div className="welcome-text">
            <h2 className='maven-pro-title2'>¡Bienvenido al Turnero de Castración de Mascotas!</h2>
            <p>Acceda a su cuenta para gestionar turnos de castración en los centros municipales de Biocórdoba. </p>
          </div>
        </div>

        <div className="login-box">
          <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-logo-mobile pb-4 pt-4">
            <img src={bienestarImage} alt="Logo pequeño" />
          </div>
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
