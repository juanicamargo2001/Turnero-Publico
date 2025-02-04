import React from 'react'
import { useState, useEffect, useContext } from 'react'
import loginService from '../../services/login/login.service'
import EditarPerfil from './EditarPerfil'
import CambiarContraseña from './CambiarContraseña'
import EditarPeriflRol from './EditarPeriflRol'

export default function Perfil() {
    const [nombreUsuario, setNombreUsuario] = useState(null)
    const [apellidoUsuario, setApellidoUsuario] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [seccionActiva, setSeccionActiva] = useState(null)

    const fetchNombreUsuario = async () => {
        try {
            const dataUsuario = await loginService.userName();
            const rolUsuario = await loginService.userRol();

            if (rolUsuario === "vecino") {
              setSeccionActiva("editarPerfil");
            } else {
              setSeccionActiva("editarPerfil2");
            }

            setUserRole(rolUsuario)
            setNombreUsuario(dataUsuario.nombre)
            setApellidoUsuario(dataUsuario.apellido)

            //console.log(userRole)
        } catch (error) {
            setNombreUsuario(null)
            alert("Error al cargar los datos del usuario")
        }
    }

    const handleEditarPerfil = () =>{
      if(userRole === "vecino"){
        setSeccionActiva("editarPerfil")
      }else{
        setSeccionActiva("editarPerfil2")
      }
    }

    useEffect(() => {
      setSeccionActiva(null);
      fetchNombreUsuario()
    }, [])

    if (!apellidoUsuario || !nombreUsuario || !userRole) return <div>Cargando...</div>
    
  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">Mi perfil</h2>
      <h5 >{apellidoUsuario}, {nombreUsuario}</h5>

      <div style={{ display: "flex" }}>
        <div style={{ flex: "0.3", borderRight: "1px solid #ddd" }}>
          <div>
            <button
              className={`btn btn-link ${(seccionActiva === "editarPerfil" || 
                                          seccionActiva === "editarPerfil2") ? "active" : ""}`}
              onClick={() => handleEditarPerfil()}
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
          {seccionActiva === "editarPerfil2" && <EditarPeriflRol
            nombre={nombreUsuario}
            apellido={apellidoUsuario}
            rol={userRole}
          />}
          {seccionActiva === "cambiarContraseña" && <CambiarContraseña />}
        </div>
      </div>

    </div>
    
    
  )
}
