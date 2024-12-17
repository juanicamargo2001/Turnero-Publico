import React from 'react'
import { useForm } from 'react-hook-form'
import loginService from '../../services/login.service';
import './Perfil.css'

export default function CambiarContraseña() {
     const { register, handleSubmit, formState: { errors }, watch} = useForm()

     const onSubmit = async (data) =>{
        if(data.nuevaContraseña !== data.contraseñaAnterior){
            const passwordRequest = {
                contraseñaAnterior: data.contraseñaAnterior,
                nuevaContraseña: data.nuevaContraseña
            }

            try{
                const response = await loginService.changePassword(passwordRequest)
                console.log(response)
                alert("Contraseña cambiada con exito")
            }catch(error){
                console.log(error)
            }
        }else{
            console.log("La nueva contraseña debe ser diferente a la anterior")
        }
     }

  return (
    <div className='container mt-4'>
        <h3 className='titulo-form'>Cambiar contraseña</h3>
        <form className='formulario-contraseña' onSubmit={handleSubmit(onSubmit)}>
            <div className='campo-contraseña'>
                <label htmlFor='contraseñaAnterior' className='form-label'>Ingrese la contraseña anterior</label>
                <input
                    type="password"
                    className="form-control"
                    id="contraseñaAnterior"
                    placeholder='Ingresar contraseña actual'
                    {...register('contraseñaAnterior', {required: "La contraseña anterior es requerida"})}
                />
                {errors.contraseñaAnterior && <p style={{ color: 'red' }}>{errors.contraseñaAnterior.message}</p>}
            </div>
            <div className='campo-grid'>
                <div className='campo-contraseña'>
                <label htmlFor='nuevaContraseña' className='form-label'>Ingrese la contraseña nueva</label>
                <input
                    type="password"
                    className="form-control"
                    id="nuevaContraseña"
                    placeholder='Ingrese nueva contraseña'
                    {...register('nuevaContraseña', {required: "La contraseña nueva es requerida",
                        minLength: {
                            value: 8,
                            message: "La contraseña nueva debe tener al menos 8 caracteres"
                          }
                    })}
                />
                {errors.nuevaContraseña && <p style={{ color: 'red' }}>{errors.nuevaContraseña.message}</p>}
                </div>
                
                <div className='campo-contraseña'>
                <label htmlFor='nuevaContraseñaConfirm' className='form-label'>Confirme la contraseña nueva</label>
                <input
                    type="password"
                    className="form-control"
                    id="nuevaContraseñaConfirm"
                    placeholder='Vuelva a ingresar nueva contraseña'
                    {...register('nuevaContraseñaConfirm', {required: "Confirme la contraseña nueva", 
                        validate: (value) => value === watch('nuevaContraseña') || "Las contraseñas no coinciden"
                    })}
                />
                {errors.nuevaContraseñaConfirm && <p style={{ color: 'red' }}>{errors.nuevaContraseñaConfirm.message}</p>}
                </div>
            </div>

            <div className='boton-container'>
                <button type='submit' className='btn btn-guardar confir'>Guardar</button>
            </div>
        </form>
    </div>
  )
}
