import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../index.css";
import logo from '../imgs/logoBiocCordoba.png'; // Ajusta la ruta según la ubicación del archivo
import loginService from "../services/login.service";
import { useUserRole } from "./Login/UserRoleContext";
import Cookies from 'js-cookie';

function Menu() {
  // Simula el rol del usuario. Puedes obtenerlo desde un servicio o contexto en una aplicación real.
  //const [userRole, setUserRole] = useState("default");// Cambia el rol para probar: "administrador" o "vecino"
  const { userRole, setUserRole } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userRole.nombre) {
      const fetchUserRole = async () => {
        try {
          const rol = await loginService.userRol();
          const resNom = await loginService.userName();
          setUserRole({rol:rol, nombre:resNom.nombre});
        } catch (error) {
          console.log("Error al obtener el rol", error);
          setUserRole({rol:"default"});
        }
      };
    
      fetchUserRole();
    }
  }, []);

  const handleLogout = () => {
    setUserRole({rol:""});

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
      { label: "Veterinarios", path: "/modificar/veterinario" },
      { label: "Centros", path: "/modificar/centro" },
      { label: "Asignar Centro", path: "/registrar/veterinarioXcentro" },
      { label: "Habilitar turnero", path: "/habilitar/alberdi" },
      { label: "Registrar Vecino", path: "/registrar/vecino" },
      { label: "Turnos", path: "/turno" },
      { label: "Mis Turnos", path: "/misTurnos" },
      { label: "Animal", path: "/registrar/animal" },
    ],
    administrador: [
      { label: "Veterinarios", path: "/modificar/veterinario" },
      { label: "Centros", path: "/modificar/centro" },
      { label: "Asignar Centro", path: "/registrar/veterinarioXcentro" },
      { label: "Habilitar turnero", path: "/habilitar/alberdi" },
      { label: "Registrar Vecino", path: "/registrar/vecino" },
      { label: "Turnos", path: "/turno" },
      { label: "Mis Turnos", path: "/misTurnos" },
      { label: "Animal", path: "/registrar/animal" },
    ],
    vecino: [
      { label: "Turnos", path: "/turno" },
      { label: "Mis Turnos", path: "/misTurnos" },
      { label: "Animal", path: "/registrar/animal" },
    ],
    superAdministrador: [
      { label: "Veterinarios", path: "/modificar/veterinario" },
      { label: "Centros", path: "/modificar/centro" },
      { label: "Asignar Centro", path: "/registrar/veterinarioXcentro" },
      { label: "Habilitar turnero", path: "/habilitar/alberdi" },
      { label: "Registrar Vecino", path: "/registrar/vecino" },
      { label: "Turnos", path: "/turno" },
      { label: "Mis Turnos", path: "/misTurnos" },
      { label: "Animal", path: "/registrar/animal" },
    ]
  };

  // Selecciona las opciones del menú según el rol del usuario
  const selectedMenuOptions = menuOptions[userRole.rol] || [];
  console.log(userRole.rol);

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
            {selectedMenuOptions.map((option, index) => (
              <li key={index} className="nav-item">
                <a className="nav-link" href={option.path}>
                  {option.label}
                </a>
              </li>
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
                    <a className="dropdown-item" href="/misTurnos">
                      Mis Turnos
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
