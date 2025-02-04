import React from 'react'
import { useForm } from 'react-hook-form'
import loginService from '../../services/login/login.service'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import MensajeRecuperacion from './MensajeRecuperacion'

export default function RecuperarContraseña() {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [emailEnviado, setEmailEnviado] = useState(null);
    const navigate = useNavigate()

    const onSubmit = (data) => {
        console.log(data)
        setEmailEnviado(data.email)
        
        // try {
        //     await loginService.recoverPassword(data.email)
        //     setEmailEnviado(data.email)
        // } catch (error) {
        //     alert("Error al enviar el mail")
        // }
    } 

    const handleOk = () => {
        setEmailEnviado(null); 
        navigate("/iniciarsesion")
      };
    
      if (emailEnviado) {
        return <MensajeRecuperacion email={emailEnviado} onOk={handleOk} />;
      }

  return (
    <div className='container mt-4 page-container'>
        <h3 className='maven-pro-title'>Recuperar contraseña</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="maven-pro-body">
        <div className="mb-3">
          <label htmlFor="email" style={{fontSize: "15px"}} className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Ingrese el email de la cuenta"
            {...register('email', { required: "El email es necesario",
                pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "El formato del email es inválido"
                  }
             })}
          />
          {errors.email && <p style={{ color: 'red', padding: "5px 5px 0"}}>{errors.email.message}</p>}
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary confir">Confirmar</button>
        </div>
        </form>
    </div>
  )
}
