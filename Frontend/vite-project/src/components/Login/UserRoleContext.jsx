import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";

// Crear el contexto
const UserRoleContext = createContext();

// Proveedor del contexto
export const UserRoleProvider = ({ children }) => {

  const [userRole, setUserRole] = useState({
    rol: "",  
    nombre: "",     
  });


  /*useEffect(() => {
    console.log("userRole actualizado:", userRole);
  }, [userRole]);*/

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useUserRole = () => useContext(UserRoleContext);
