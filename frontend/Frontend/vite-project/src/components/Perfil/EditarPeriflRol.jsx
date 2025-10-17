import React from 'react'

export default function EditarPeriflRol({nombre, apellido, rol}) {
  return (
    <div>
      <div className="container mt-4">
        <h3 className='titulo-form'>Editar perfil</h3>
        <form className='formulario-editar'>
          <div className='seccion'>
          <h5>Mis datos</h5>
            <div className='campo-nombre-apellido'>
              <div className='campo'>
              <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  value={nombre}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', color: '#6c757d', cursor: 'not-allowed' }}
                />
              </div>

              <div className="campo">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  value={apellido}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', color: '#6c757d', cursor: 'not-allowed' }}
                />
              </div>
            </div>
            

            <div className="campo">
                <label htmlFor="rol" className="form-label">Rol</label>
                <input
                  type="text"
                  className="form-control"
                  id="rol"
                  value={rol.toUpperCase()}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', color: '#6c757d', cursor: 'not-allowed' }}
                />
            </div>

        </div>
        </form>
       </div>
    </div>
  )
}
