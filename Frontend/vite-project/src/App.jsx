import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import  RegistroAnimal  from "./components/Registro_Animal";
import { Menu } from "./components/Menu"; // Asegúrate de que la ruta sea correcta

function App() {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <div className="divBody">
          <Routes>
          <Route path="/" element={<h1>Bienvenido a la aplicación</h1>} />
            <Route path="/registrar/animal" element={<RegistroAnimal/>} />
            
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
