import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  RegistroAnimal  from "./components/Registro_Animal";
import Veterinarios from "./components/Veterinario/Modificar_Veterinario";
import { Menu } from "./components/Menu"; // Asegúrate de que la ruta sea correcta
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


function App() {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <div className="divBody">
          <Routes>
            <Route path="/" element={<h1>Bienvenido a la aplicación</h1>} />
            <Route path="/turno" element={<CentrosCastracionList/>}/>
            <Route path="/registrar/animal" element={<RegistroAnimal/>} />
            <Route path="/registrar/veterinario" element={<RegistroVeterinario/>} />
            <Route path="/modificar/veterinario" element={<Veterinarios/>} />
            <Route path="/registrar/centro" element={<Registro_Centro/>} />
            <Route path="/registrar/vecino" element={<Registro_Vecino/>}></Route>
            
            <Route path="/habilitar/alberdi" element={<HabilitarTurneroAlberi/>}/>
            <Route path="/habilitar/lafrance" element={<HabilitarTurneroLafrance/>}/>
            <Route path="/habilitar/villallende" element={<HabilitarTurneroVilla/>}/>

            <Route path="/modificar/centro" element={<Modificar_Centro/>} />


            <Route path="/tipoAnimal/alberdi" element={<TipoAnimal_Vecino/>} />
            <Route path="/tipoAnimal/lafrance" element={<TipoAnimal_Vecino/>} />
            <Route path="/tipoAnimal/villallende" element={<TipoAnimal_Vecino/>} />
            
            <Route path="/registrar/turno/alberdi" element={<Turnero nombreCentro={"Alberdi"} turnoId={14} />} />
            <Route path="/registrar/turno/lafrance" element={<Turnero nombreCentro={"La France"} turnoId={15} />} />
            <Route path="/registrar/turno/villaallende" element={<Turnero nombreCentro={"Villa Allende Parque"} turnoId={16} />} />
            <Route path="/registrar/veterinarioXcentro" element={<RegistroVeterinarioXCentro/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;