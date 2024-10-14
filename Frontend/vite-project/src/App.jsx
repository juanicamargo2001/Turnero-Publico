import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  RegistroAnimal  from "./components/Registro_Animal";
import Veterinarios from "./components/Veterinario/Modificar_Veterinario";
import { Menu } from "./components/Menu"; // Asegúrate de que la ruta sea correcta
import RegistroVeterinario from "./components/Veterinario/Registro_Veterinario";
import Registro_Centro from "./components/Centro/Registro_Centro";
import Modificar_Centro from "./components/Centro/Modificar_Centro"
import Turnero from "./components/Turnero/Turnero";
<<<<<<< HEAD
import HabilitarTurnero from "./components/Turnero/HabilitarTurnero";
=======
import RegistroVeterinarioXCentro from "./components/Veterinario/Asignar_Centro";
>>>>>>> e4957a629ce9a862bbcc52f0ca0222d3b0117f4c

function App() {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <div className="divBody">
          <Routes>
            <Route path="/" element={<h1>Bienvenido a la aplicación</h1>} />
            <Route path="/registrar/animal" element={<RegistroAnimal/>} />
            <Route path="/registrar/veterinario" element={<RegistroVeterinario/>} />
            <Route path="/modificar/veterinario" element={<Veterinarios/>} />
            <Route path="/registrar/centro" element={<Registro_Centro/>} />
<<<<<<< HEAD
            <Route path="/habilitar" element={<HabilitarTurnero/>}/>
=======
            <Route path="/modificar/centro" element={<Modificar_Centro/>} />
>>>>>>> e4957a629ce9a862bbcc52f0ca0222d3b0117f4c
            <Route path="/registrar/turno" element={<Turnero/>} />
            <Route path="/registrar/veterinarioXcentro" element={<RegistroVeterinarioXCentro/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
