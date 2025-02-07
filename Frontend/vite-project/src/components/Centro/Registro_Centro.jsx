import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { centroService } from '../../services/centro/centro.service';
import { provinciaService } from '../../services/provincia/provincia.service';
import { useState } from 'react';
import { FormControl } from '@mui/material';
import {useNavigate} from "react-router-dom"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';



const Registro_Centro = () => {

    const {register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState(null);
    const [horaInicio, setHoraInicio] = useState(dayjs().set('hour', 7).set('minute', 0).set('second', 0));
    const [horaFin, setHoraFin] = useState(dayjs().set('hour', 19).set('minute', 0).set('second', 0));
    const [barrios, setBarrios] = useState([]); 
    const [sugerencias, setSugerencias] = useState([]); 
    const [barrioSeleccionado, setBarrioSeleccionado] = useState(""); 
    const navigate = useNavigate();


    const fetchBarrios = async (pattern) => {
      try {
        const data = await provinciaService.getBarriosCba(pattern);
        const barriosObtenidos = data.features.map(b => b.attributes.nombre);
        setBarrios(barriosObtenidos);
      } catch {
        setError("Error al cargar los barrios. Por favor, inténtelo de nuevo.");
      }
    };

    const handleBarrioInput = (e) => {
      const valor = e.target.value;
      setBarrioSeleccionado(valor);

      if (valor.length >= 3) {
        const filtrados = barrios.filter(barrio =>
          barrio.toLowerCase().includes(valor.toLowerCase())
        );
        setSugerencias(filtrados);
      } else {
        // Limpiar sugerencias si no hay texto o es menor a 3 caracteres
        setSugerencias([]);
      }
    };

    const seleccionarBarrio = (barrio) => {
      setBarrioSeleccionado(barrio);
      setSugerencias([]);
    };

    const capitalizeWords = (text) => {
      return text
        .toLowerCase() // Convertimos todo a minúsculas
        .split(" ")    // Dividimos el texto en palabras
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizamos la primera letra
        .join(" ");    // Unimos las palabras nuevamente
    };

    
    const onSubmit = async (data) =>{
        const nuevoCentro = {
            nombre: data.nombre,
            barrio: capitalizeWords(barrioSeleccionado),
            calle: data.calle,
            altura: parseInt(data.altura),
            habilitado: true,
            horaLaboralInicio: horaInicio.format("hh:mm:ss"),
            horaLaboralFin: horaFin.format("H:mm:ss")
        }
        
        console.log(nuevoCentro)
        try {
            await centroService.Grabar(nuevoCentro);
            Swal.fire({
              title: "¡Éxito!",
              text: "Centro registrado con exito!",
              icon: "success",
              confirmButtonColor: "#E15562",
              confirmButtonText: "OK",
            }).then(() => {
          });
            navigate("/modificar/centro")
        } catch (error) {
            setError("Error al registrar el centro. Por favor, inténtelo de nuevo.");
            console.error("Error al registrar el centro:", error.response ? error.response.data : error); 
        }
    }

    // Cargar barrios al montar el componente
    useEffect(() => {
      fetchBarrios("");
    }, []);

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
              value={barrioSeleccionado}
              onChange={handleBarrioInput} 
            />
            {errors.barrio && <div className="invalid-feedback">{errors.barrio.message}</div>}
            <div className="autocomplete-list">
              {sugerencias.map((barrio, index) => (
                <div
                  key={index}
                  className="autocomplete-item"
                  onClick={() => seleccionarBarrio(barrio)}
                >
                  {capitalizeWords(barrio)}
                </div>
              ))}
            </div>
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