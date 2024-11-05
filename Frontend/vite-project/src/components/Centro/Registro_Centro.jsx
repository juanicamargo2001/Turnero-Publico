import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { centroService } from '../../services/centro.service';
import { provinciaService } from '../../services/provinciasService';
import { useState } from 'react';
import { MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import {useNavigate} from "react-router-dom"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';



const Registro_Centro = () => {

    const {register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const [horaInicio, setHoraInicio] = useState(dayjs().set('hour', 7).set('minute', 0).set('second', 0));
    const [horaFin, setHoraFin] = useState(dayjs().set('hour', 19).set('minute', 0).set('second', 0));
    //const [pattern, setPattern] = useState("YOFRE");
    const navigate = useNavigate();


    /*const fetchBarrios = async(pattern) => {
      try{
          const data = await provinciaService.getBarriosCba(pattern);
          console.log(data)
      } catch(error){
          setError(error)
      }
  }*/
    
    const onSubmit = async (data) =>{
        const nuevoCentro = {
            nombre: data.nombre,
            barrio: data.barrio,
            calle: data.calle,
            altura: parseInt(data.altura),
            habilitado: true,
            horaLaboralInicio: horaInicio.format("hh:mm:ss"),
            horaLaboralFin: horaFin.format("H:mm:ss")
        }
        
        //console.log(nuevoCentro)
        try {
            await centroService.Grabar(nuevoCentro);
            alert("Centro registrado con exito!")
            navigate("/modificar/centro")
        } catch (error) {
            setError("Error al registrar el centro. Por favor, inténtelo de nuevo.");
            console.error("Error al registrar el centro:", error.response ? error.response.data : error); 
        }
    }

    /*useEffect(()=>{
      fetchBarrios(pattern);
    }, [])*/

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
        <div className="mb-3">
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
        <label htmlFor="horariosLaborales" className='form-label'>Horarios Laborales</label>
        </div>
        <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Horario Inicio"
            minTime={dayjs().set('hour', 6).startOf("hour")} 
            defaultValue={horaInicio}
            onChange={(nuevaHoraInicio) => setHoraInicio(nuevaHoraInicio)}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
          <span style={{ margin: '0 10px' }}>//</span>
          <TimePicker
            label="Horario Fin"
            maxTime={dayjs().set('hour', 21).startOf("hour")}
            defaultValue={horaFin}
            onChange={(nuevaHoraFin) => setHoraFin(nuevaHoraFin)}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
          />
        </LocalizationProvider>
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>
        </form>
    </div>
  )
}

export default Registro_Centro;