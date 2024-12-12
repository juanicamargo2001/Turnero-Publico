
import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";

// Crear el contexto
const UserRoleContext = createContext();

// Proveedor del contexto
export const UserRoleProvider = (props) => {

  const [userRole, setUserRole] = useState(()=>{
    const savedRole = sessionStorage.getItem('userRole'); 
    return savedRole ? JSON.parse(savedRole) : { nombre: '', rol: 'default' };
  });

  useEffect(() => {
    sessionStorage.setItem('userRole', JSON.stringify(userRole));
  }, [userRole]);

  return (
    <UserRoleContext.Provider value={{userRole, setUserRole}}>
      {props.children}
    </UserRoleContext.Provider>
  );
};

export default UserRoleContext;
