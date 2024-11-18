import React, { createContext, useState, useContext } from "react";

// Crear el contexto
const UserRoleContext = createContext();

// Proveedor del contexto
export const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </UserRoleContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useUserRole = () => useContext(UserRoleContext);
