import { Navigate } from "react-router-dom";
import loginService from "../../services/login.service";
import React from "react";
import Default from "../Default/Default";

const RutaProtegida = ({ rolesPermitidos, children }) => {
  const verificarAcceso = async () => {
    try {
      const rol = await loginService.userRol();
      return rolesPermitidos.includes(rol);
    } catch (error) {
      console.error("Error al verificar rol del usuario:", error);
      return false;
    }
  };

  const [permitido, setPermitido] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      const acceso = await verificarAcceso();
      setPermitido(acceso);
    })();
  }, []);

  if (permitido === null) {
    return; // Puedes mostrar un loader mientras se verifica
  }

  return permitido ? children : <Default/>;
};

export default RutaProtegida;
