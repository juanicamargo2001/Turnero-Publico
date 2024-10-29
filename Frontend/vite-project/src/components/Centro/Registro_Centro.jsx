import React from 'react'
import { useForm } from 'react-hook-form'
import { centroService } from '../../services/centro.service';
import { useState } from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import {useNavigate} from "react-router-dom"


const Registro_Centro = () => {

    const {register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const horasDisponibles = [
      '07:00', '08:00', '09:00', '10:00', '11:00', 
      '12:00', '13:00', '14:00', '15:00', '16:00', 
      '17:00', '18:00', '19:00'
    ];
    const navigate = useNavigate();
    
    const onSubmit = async (data) =>{
        const nuevoCentro = {
            nombre: data.nombre,
            barrio: data.barrio,
            calle: data.calle,
            altura: parseInt(data.altura),
            habilitado: true,
            horaLaboralInicio: data.horaInicio + ":00",
            horaLaboralFin: data.horaFin + ":00"
        }
        
        console.log(nuevoCentro)
        /*try {
            await centroService.Grabar(nuevoCentro);
            alert("Centro registrado con exito!")
            navigate("/modificar/centro")
        } catch (error) {
            setError("Error al registrar el centro. Por favor, inténtelo de nuevo.");
            console.error("Error al registrar el centro:", error.response ? error.response.data : error); 
        }*/
    }

  return (
    <div className='container mt-4'>
        <h2 className='maven-pro-title'> INGRESAR DATOS CENTRO DE CASTRACIÓN</h2>
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
        <FormControl className="mb-3" fullWidth sx={{ mb: 2 }}>
        <div>
            <label htmlFor="altura" className="form-label">Altura</label>
            <input
              type="number"
              className={`form-control ${errors.altura ? "is-invalid" : ""}`}
              id="altura"
              placeholder="Ingrese la altura (opcional)"
              {...register("altura", {valueAsNumber: "La altura debe ser un numero", 
                validate: value => value > -1 || "La altura debe ser 0 o superior"
              })}
            />
            {errors.altura && <div className="invalid-feedback">{errors.altura.message}</div>}
        </div>
        </FormControl> 
        <div className="mb-3">
          <label className="form-label">Horarios</label>
        </div>
        <div className="mb-3">
        <FormControl className="mb-3" fullWidth error={!!errors.horaInicio}>
          <InputLabel>Seleccionar hora de inicio laboral</InputLabel>
          <Select
              label="Hora de Inicio"
              {...register("horaInicio", { required: "La hora de inicio es requerida" })}
              onChange={(e) => setValue("horaInicio", e.target.value)}
              defaultValue={"07:00"}
          >
              {horasDisponibles.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                      {hora}
                  </MenuItem>
              ))}
          </Select>
          {errors.horaInicio && <div className="invalid-feedback">{errors.horaInicio.message}</div>}
        </FormControl>

        <FormControl className="mb-3" fullWidth error={!!errors.horaFin}>
          <InputLabel>Seleccionar hora de fin laboral</InputLabel>
          <Select
              label="Hora de Fin"
              {...register("horaFin", { required: "La hora de fin es requerida" })}
              onChange={(e) => setValue("horaFin", e.target.value)}
              defaultValue={"19:00"}
          >
              {horasDisponibles.map((hora) => (
                  <MenuItem key={hora} value={hora}>
                      {hora}
                  </MenuItem>
              ))}
          </Select>
          {errors.horaFin && <div className="invalid-feedback">{errors.horaFin.message}</div>}
        </FormControl>
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>
        </form>
    </div>
  )
}

export default Registro_Centro;