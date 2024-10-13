import React from 'react'
import { useForm } from 'react-hook-form'
import { centroService } from '../../services/centro.service';
import { useState } from 'react';

const Registro_Centro = () => {

    const {register, handleSubmit, formState: { errors } } = useForm();
    const {error, setError} = useState(null);
    
    const onSubmit = async (data) =>{
        const nuevoCentro = {
            nombre: data.nombre,
            barrio: data.barrio,
            calle: data.calle,
            altura: parseInt(data.altura),
            habilitado: true
        }
        try {
            await centroService.Grabar(nuevoCentro);
            alert("Centro registrado con exito!")
        } catch (error) {
            setError("Error al registrar el centro. Por favor, inténtelo de nuevo.");
            console.error("Error al registrar el centro:", error.response ? error.response.data : error); 
        }
    }

  return (
    <div className='container mt-4'>
        <h2 className='maven-pro-title'> INGRESAR DATOS CENTRO DE CASTRACION</h2>
        <form className='maven-pro-body' onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            id="nombre"
            placeholder="Escriba el nombre del centro"
            {...register('nombre', {required: "El nombre es requerido"})}
          />
          {errors.nombre && <div className="invalid-feedback">{errors.nombre.message}</div>} 
        </div>
        <div className='mb-3'>
            <label htmlFor="barrio" className="form-label">Barrio</label>
            <input
              type="text"
              className={`form-control ${errors.barrio ? "is-invalid" : ""}`}
              id="barrio"
              placeholder="Ingrese el barrio"
              {...register("barrio", {required: "El barrio es requerido"})}  
            />
            {errors.barrio && <div className="invalid-feedback">{errors.barrio.message}</div>}
        </div> 
        <div className="mb-3">
            <label htmlFor="calle" className='form-label'>Calle</label>
            <input
             type="text"
             className={`form-control ${errors.calle ? "is-invalid" : ""}`}
             id="calle"
             placeholder="Ingrese la calle"
             {...register("calle", {required : "La calle es requerida"})}
            />
            {errors.calle && <div className="invalid-feedback">{errors.calle.message}</div>}
        </div> 
        <div>
            <label htmlFor="altura" className="form-label">Altura</label>
            <input
              type="number"
              className={`form-control ${errors.altura ? "is-invalid" : ""}`}
              id="altura"
              placeholder="Ingrese la altura (opcional)"
              {...register("altura", {valueAsNumber: "La altura debe ser un numero"})}
            />
            {errors.altura && <div className="invalid-feedback">{errors.altura.message}</div>}
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>
        </form>
    </div>
  )
}

export default Registro_Centro;