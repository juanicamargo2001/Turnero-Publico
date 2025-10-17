
import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";

// Crear el contexto
const UserRoleContext = createContext();

// Función para encriptar datos
const encryptData = async (data, key) => {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(JSON.stringify(data));
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Vector de inicialización (IV)

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encodedData
  );

  return { iv: Array.from(iv), encryptedData: Array.from(new Uint8Array(encryptedData)) };
};
  
// Función para desencriptar datos
async function decryptData(encryptedData, key) {
    const { iv, encryptedData: cipherText } = encryptedData;
    const ivArray = new Uint8Array(iv);
    const encryptedArray = new Uint8Array(cipherText);
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      key,
      encryptedArray
    );
  
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
}

// Proveedor del contexto
export const UserRoleProvider = (props) => {
  const [userRole, setUserRole] = useState(() => {
    const encryptedData = sessionStorage.getItem('userRole');
    const keyData = sessionStorage.getItem('cryptoKey');
    
    if (encryptedData && keyData) {
      // Intentar desencriptar los datos al inicio
      try {
        const decryptStoredRole = async () => {
          const importedKey = await crypto.subtle.importKey(
            'jwk',
            JSON.parse(keyData),
            { name: 'AES-GCM' },
            true,
            ['encrypt', 'decrypt']
          );
          const decryptedData = await decryptData(JSON.parse(encryptedData), importedKey);
          return decryptedData;
        };

        // No podemos usar `await` directamente aquí, así que devolvemos un placeholder
        decryptStoredRole().then(data => {
          setUserRole(data); // Actualizar el estado una vez que los datos sean desencriptados
        });
        return { nombre: '', rol: 'default' }; // Estado temporal
      } catch (error) {
        console.error('Error desencriptando datos del rol de usuario:', error);
        return { nombre: '', rol: 'default' };
      }
    } else {
      return { nombre: '', rol: 'default' };
    }
  });

  useEffect(() => {
    const storeUserRole = async () => {
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const encryptedData = await encryptData(userRole, key);
      sessionStorage.setItem('userRole', JSON.stringify(encryptedData));
      sessionStorage.setItem('cryptoKey', JSON.stringify(await crypto.subtle.exportKey('jwk', key)));
    };
    storeUserRole();
  }, [userRole]);

  return (
    <UserRoleContext.Provider value={{ userRole, setUserRole }}>
      {props.children}
    </UserRoleContext.Provider>
  );
};


export default UserRoleContext;