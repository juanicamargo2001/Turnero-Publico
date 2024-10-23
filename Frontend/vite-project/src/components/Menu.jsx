import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css"
import logo from '../imgs/logoBiocCordoba.png'; // Ajusta la ruta según la ubicación del archivo


function Menu() {
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
    {/*<a className="navbar-brand" href="#">Navbar</a>*/}
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
        <li className="nav-item">
          <a className="nav-link active " aria-current="page" href="/">Inicio</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/registrar/vecino">Registrar Vecino</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/turno">Turnos</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/registrar/animal">Animal</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/modificar/veterinario">Veterinarios</a>
        </li>
        <li>
          <a className="nav-link" href="/modificar/centro">Centros</a>
        </li>
        <li>
          <a className="nav-link" href="/registrar/veterinarioXcentro">Asignar Centro</a>
        </li>
        <li>
          <a className="nav-link" href="/habilitar">Habilitar turnero</a>
        </li>
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          ><i class="far fa-user"></i>
             Nombre Apellido
          </a>
          <ul className="dropdown-menu">
            <li><a className="dropdown-item" href="#">Action</a></li>
            <li><a className="dropdown-item" href="#">Another action</a></li>
            <li><a className="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>




  );
}

export { Menu };
