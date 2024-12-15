import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserRoleProvider } from "./components/Login/UserRoleContext";
import  RegistroAnimal  from "./components/Registro_Animal";
import Veterinarios from "./components/Veterinario/Modificar_Veterinario";
import { Menu } from "./components/Menu";
import  Footer  from "./components/Footer";
import RegistroVeterinario from "./components/Veterinario/Registro_Veterinario";
import Registro_Centro from "./components/Centro/Registro_Centro";
import Modificar_Centro from "./components/Centro/Modificar_Centro"
import Turnero from "./components/Turnero/Turnero";
import Registro_Vecino from "./components/Vecino/Registro_Vecino";

import HabilitarTurneroAlberi from "./components/Turnero/HabilitarTurnero_Alberdi";

import RegistroVeterinarioXCentro from "./components/Veterinario/Asignar_Centro";
import CentrosCastracionList from "./components/Turnero/Centro_Vecino";
import TipoAnimal_Vecino from "./components/Turnero/TipoAnimal_Vecino";
import HabilitarTurneroLafrance from "./components/Turnero/HabilitarTurneri_Lafrance.jsx";
import HabilitarTurneroVilla from "./components/Turnero/HabilitarTurneri_Villa.jsx";

import InicioSesion from "./components/Login/InicioSesion.jsx"
import TurnoVecino from "./components/Turnos_Vecino.jsx";

import TurnosSecretaria from './components/Secretaria/TurnosSecretaria';

import loginService from "./services/login.service.js";
import RutaProtegida from "./components/RutasProtegidas/RutasProtegidas.jsx";
import Default from "./components/Default/Default.jsx";
import Inicio from "./components/Inicio.jsx";
import Registro_Vecino_Minimo from "./components/Secretaria/Registro_Vecino_Minimo.jsx";
import Turnos_Urgencia from "./components/Secretaria/Turnos_Urgencia.jsx"
import EditarPerfil from "./components/Perfil/EditarPerfil.jsx";
import Perfil from "./components/Perfil/Perfil.jsx";
import CambiarContraseña from "./components/Perfil/CambiarContraseña.jsx";

function App() {
  return (
    <>
      <UserRoleProvider>
        <BrowserRouter>
          
          <Menu />
          <div className="divBody">
            <Routes>

              <Route path="/turno"
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador","administrador", "secretaria", "vecino"]}>
                    <CentrosCastracionList />
                  </RutaProtegida>
                }
              />


              <Route path="/registrar/animal" 
              element={
                <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria", "vecino"]}>
                  <RegistroAnimal/>
                </RutaProtegida>
                } />


              <Route path="/registrar/veterinario" 
              element={
              <RutaProtegida rolesPermitidos={["superAdministrador", "administrador"]}>
                <RegistroVeterinario/>
              </RutaProtegida>
              } />


              <Route path="/modificar/veterinario" 
              element={
                <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <Veterinarios/>
                </RutaProtegida>
                } />
              

              <Route path="/registrar/centro" 
              element={
                <RutaProtegida rolesPermitidos={["superAdministrador", "administrador"]}>
                  <Registro_Centro/>
                </RutaProtegida>
                } />
              
              
              <Route path="/registrar/vecino" element={<Registro_Vecino/>}></Route>
              

              <Route path="/habilitar/alberdi" 
              element={
                <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <HabilitarTurneroAlberi/>
                </RutaProtegida>
                } />
              
              
              <Route path="/habilitar/lafrance" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <HabilitarTurneroLafrance/>
                </RutaProtegida>
                } />
                
              
              <Route path="/habilitar/villallende" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <HabilitarTurneroVilla/>
                </RutaProtegida>
                } />


              <Route path="/modificar/centro" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <Modificar_Centro/>
                </RutaProtegida>
                } />
                

              <Route path="/tipoAnimal/alberdi" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "vecino"]}>
                  <TipoAnimal_Vecino/>
                </RutaProtegida>
                } />

              <Route path="/tipoAnimal/lafrance" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "vecino"]}>
                  <TipoAnimal_Vecino/>
                </RutaProtegida>
                } />
              
              
              <Route path="/tipoAnimal/villallende" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "vecino"]}>
                  <TipoAnimal_Vecino/>
                </RutaProtegida>
                } />

              
              <Route path="/registrar/turno/alberdi" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "vecino"]}>
                  <Turnero nombreCentro={"Alberdi"} turnoId={14} />
                </RutaProtegida>
                } />
        
              
              <Route path="/registrar/turno/lafrance" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "vecino"]}>
                  <Turnero nombreCentro={"La France"} turnoId={15} />
                </RutaProtegida>
                } />
                
              
              <Route path="/registrar/turno/villaallende" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "vecino"]}>
                  <Turnero nombreCentro={"Villa Allende Parque"} turnoId={16} />
                </RutaProtegida>
                } />
                
              
              <Route path="/registrar/veterinarioXcentro" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <RegistroVeterinarioXCentro/>
                </RutaProtegida>
                } />
                

              <Route path="/iniciarsesion" element={<InicioSesion/>} />

              <Route path="/" element={<Inicio/>} />

              <Route path="/misTurnos" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "vecino", "secretaria"]}>
                  <TurnoVecino/>
                </RutaProtegida>
                } />
                

              <Route path="/secretaria/turnos" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <TurnosSecretaria />
                </RutaProtegida>
                } />
                
              <Route path="/secretaria/registro-vecino-minimo" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <Registro_Vecino_Minimo />
                </RutaProtegida>
                } />              

              <Route path="/secretaria/turno-urgencia" 
                element={
                  <RutaProtegida rolesPermitidos={["superAdministrador", "administrador", "secretaria"]}>
                  <Turnos_Urgencia />
                </RutaProtegida>
                } />

              <Route path="/perfil"
                element={
                  <RutaProtegida rolesPermitidos={["vecino"]}>
                    <Perfil/>
                  </RutaProtegida>
                } />  

              <Route path="*" element={<Default/>} />

            </Routes>
          </div>
          <Footer/>

        </BrowserRouter>
      </UserRoleProvider>
    </>
  );
}

export default App;