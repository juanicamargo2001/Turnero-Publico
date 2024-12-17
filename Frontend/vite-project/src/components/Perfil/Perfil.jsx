import React from 'react'
import { useState, useEffect } from 'react'
import loginService from '../../services/login.service'
import EditarPerfil from './EditarPerfil'
import CambiarContraseña from './CambiarContraseña'

export default function Perfil() {
    const [nombreUsuario, setNombreUsuario] = useState(null)
    const [apellidoUsuario, setApellidoUsuario] = useState(null)
    const [seccionActiva, setSeccionActiva] = useState("editarPerfil")

    const fetchNombreUsuario = async () => {
        try {
            const dataUsuario = await loginService.userName();
            setNombreUsuario(dataUsuario.nombre)
            setApellidoUsuario(dataUsuario.apellido)
        } catch (error) {
            setNombreUsuario(null)
            alert("Error al cargar los datos del usuario")
        }
    }

    useEffect(() => {
        fetchNombreUsuario()
    }, [])

    if (!apellidoUsuario || !nombreUsuario) return <div>Cargando...</div>
    
  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">Mi perfil</h2>
      <h5 >{apellidoUsuario}, {nombreUsuario}</h5>

      <div style={{ display: "flex" }}>
        <div style={{ flex: "0.3", borderRight: "1px solid #ddd" }}>
          <div>
            <button
              className={`btn btn-link ${seccionActiva === "editarPerfil" ? "active" : ""}`}
              onClick={() => setSeccionActiva("editarPerfil")}
            >
              Editar Perfil
            </button>
          </div>
          <div>
            <button
              className={`btn btn-link ${seccionActiva === "cambiarContraseña" ? "active" : ""}`}
              onClick={() => setSeccionActiva("cambiarContraseña")}
            >
              Contraseña
            </button>
          </div>
        </div>

        {/* Columna de la derecha para renderizar componentes */}
        <div style={{ flex: "0.7", paddingLeft: "20px" }}>
          {seccionActiva === "editarPerfil" && <EditarPerfil />}
          {seccionActiva === "cambiarContraseña" && <CambiarContraseña />}
        </div>
      </div>

    </div>
    
    
  )
}
