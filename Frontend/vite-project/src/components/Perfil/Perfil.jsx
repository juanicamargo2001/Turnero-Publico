import { useState, useEffect } from 'react'
import loginService from '../../services/login/login.service'
import EditarPerfil from './EditarPerfil'
import CambiarContraseña from './CambiarContraseña'
import EditarPeriflRol from './EditarPeriflRol'
import Swal from 'sweetalert2';
import { DotLoader } from 'react-spinners'; 

export default function Perfil() {
    const [nombreUsuario, setNombreUsuario] = useState(null)
    const [apellidoUsuario, setApellidoUsuario] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [seccionActiva, setSeccionActiva] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    const fetchNombreUsuario = async () => {
      setIsLoading(true)
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
            setIsLoading(false)  
        } catch {
            setIsLoading(false)
            setNombreUsuario(null)
            Swal.fire({
              title: "¡Error!",
              text: "Error al cargar los datos del usuario",
              icon: "error",
              confirmButtonColor: "#E15562",
              confirmButtonText: "OK",
            });
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

    // if (!apellidoUsuario || !nombreUsuario || !userRole) return (               >
    // ))
    
  return (
    <div className="container mt-4 maven-pro-body">
       {isLoading && (
      <div className="loading-overlay">
        <DotLoader color="#60C1EA" />
      </div>)}
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
