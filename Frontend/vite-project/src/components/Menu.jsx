import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../index.css";
import logo from '../imgs/logoBiocCordoba.png'; // Ajusta la ruta según la ubicación del archivo
import UserRoleContext from "./Login/UserRoleContext";
import Cookies from 'js-cookie';

function Menu() {
  const { userRole, setUserRole } = useContext(UserRoleContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserRole({nombre:"", rol:"default"});

    Cookies.remove('token');
    Cookies.remove('refreshToken');

    // Redirige al usuario al inicio o página de login
    navigate('/'); 
  };

  // Opciones de menú según el rol
  const menuOptions = {
    default: [
      { label: "Iniciar Sesión", path: "/iniciarsesion" },
      { label: "Registrarse", path: "/registrar/vecino" }
    ],
    secretaria: [
      { label: "Registrar Turno", path: "/asignar/turno" },
      { label: "Veterinarios", path: "/modificar/veterinario" },
      { label: "Centros", path: "/modificar/centro" },
      { label: "Turnos del dia", path: "/secretaria/turnos" },
      {
        label: "Medicamentos",
        subOptions: [
          { label: "Medicamentos", path: "/medicamentos" },
          { label: "Unidades", path: "/unidades" },
        ],
      },

      // { label: "Animal", path: "/registrar/animal" },
    ],
    administrador: [
      { label: "Cancelar turnos", path: "/cancelar/masivo" },
      { label: "Veterinarios", path: "/modificar/veterinario" },
      { label: "Centros", path: "/modificar/centro" },
      { label: "Asignar Centro", path: "/registrar/veterinarioXcentro" },
      {
        label: "Habilitar turnero",
        subOptions: [
          { label: "Alberdi", path: "/habilitar/alberdi" },
          { label: "La France", path: "/habilitar/lafrance" },
          { label: "Villa Allende", path: "/habilitar/villallende" },
        ],
      },
      
    ],
    vecino: [
      { label: "Turnos", path: "/turno" },
      { label: "Mis Turnos", path: "/misTurnos" },
      { label: "Animal", path: "/registrar/animal" }
    ],
    superAdministrador: [
      { label: "Veterinarios", path: "/modificar/veterinario" },
      { label: "Centros", path: "/modificar/centro" },
      { label: "Asignar Centro", path: "/registrar/veterinarioXcentro" },
      {label: "Crear Personal", path: "/crear-Personal"},
      {
        label: "Habilitar turnero",
        subOptions: [
          { label: "Alberdi", path: "/habilitar/alberdi" },
          { label: "La France", path: "/habilitar/lafrance" },
          { label: "Villa Allende", path: "/habilitar/villallende" },
        ],
      },
      { label: "Estadísticas", path: "/reportes" },
    ]
  };

  // Selecciona las opciones del menú según el rol del usuario
  const selectedMenuOptions = menuOptions[userRole.rol] || [];

  return (
    <nav className="navbar navbar-expand-lg custom-menu-bg w-100">
      <div className="container-fluid maven-pro-title">
        <a className="navbar-brand" href="/">
          <img
            src={logo}
            alt="Logo"
            className="d-inline-block align-text-top"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            {/*<li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/">
                Inicio
              </a>
            </li>*/}
            {/* {selectedMenuOptions.map((option, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link" href={option.path}>
                  {option.label}
                </a>
              </li>
            ))} */}
            {selectedMenuOptions.map((option, index) => (
                <React.Fragment key={index}>
                  {option.subOptions ? (
                    <li className="nav-item dropdown">
                      <a
                        className="nav-link dropdown-toggle"
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {option.label}
                      </a>
                      <ul className="dropdown-menu">
                        {option.subOptions.map((subOption, subIndex) => (
                          <li key={subIndex}>
                            <NavLink className="dropdown-item" to={subOption.path}>
                              {subOption.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ) : (
                    <li className="nav-item">
                      <NavLink className="nav-link" to={option.path}>
                        {option.label}
                      </NavLink>
                    </li>
                  )}
                </React.Fragment>
              ))}
            {userRole.nombre && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="far fa-user"></i> {userRole.nombre}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/perfil">
                      Mi perfil
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#" onClick={handleLogout}>
                      Cerrar Sesión
                    </a>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export { Menu };
