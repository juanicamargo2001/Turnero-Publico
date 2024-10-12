import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  RegistroAnimal  from "./components/Registro_Animal";
import Veterinarios from "./components/Veterinario/Modificar_Veterinario";
import { Menu } from "./components/Menu"; // Asegúrate de que la ruta sea correcta
import RegistroVeterinario from "./components/Veterinario/Registro_Veterinario";
import Registro_Centro from "./components/Registro_Centro";
import Turnero from "./components/Turnero/Turnero";

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
            <Route path="/registrar/turno" element={<Turnero/>} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
