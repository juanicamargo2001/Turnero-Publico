import React from 'react'

export default function MensajeRecuperacion({email, onOk}) {

    const enmascararEmail = (email) => {
        const [nombre, dominio] = email.split('@');
        const longitudVisible = Math.min(3, nombre.length); 
        const oculto = '*'.repeat(nombre.length - longitudVisible); 
        return `${nombre.slice(0, longitudVisible)}${oculto}@${dominio}`;
      };

  return (
    <div className="container mt-4 page-container">
      <h3 className="maven-pro-title">Correo enviado</h3>
      <p className="maven-pro-body">
        Hemos enviado un correo a <strong>{enmascararEmail(email)}</strong>. Ingresa a tu casilla y sigue las instrucciones para continuar con la recuperación de la contraseña. 
        Se establecerá una contraseña temporal que será enviada a tu correo.
      </p>
      <div className="d-flex justify-content-center">
        <button style={{ minWidth: "180px", whiteSpace: "normal" }} className="btn btn-primary confir" onClick={onOk}>Volver a iniciar sesion</button>
      </div>
    </div>
  )
}
