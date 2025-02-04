import React, { useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";
import {veterinarioService} from "../../services/veterinario/veterinario.service";
import { provinciaService } from '../../services/provincia/provincia.service';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';

const RegistroVeterinario = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm();

  const today = new Date();
  const maxDate = new Date(today.getTime() - (6575 * 24 * 60 * 60 * 1000)); // Resta 6570 días o 18 años
  const navigate = useNavigate();
  const [barrios, setBarrios] = useState([]); 
  const [sugerencias, setSugerencias] = useState([]); 
  const [barrioSeleccionado, setBarrioSeleccionado] = useState(""); 

  useForm({
    mode: 'onSubmit',
    defaultValues: {
      fNacimiento: null,
    }
  });

  useEffect(() => {
    register('fNacimiento', { 
      required: "La fecha de nacimiento es obligatoria",

      /*validate: (value) => {
          if (!value || !value[0]) return "La fecha de nacimiento es obligatoria";

          const fechaNacimiento = new Date(value[0]);
          const hoy = new Date();
          const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
          const mes = hoy.getMonth() - fechaNacimiento.getMonth();

          // Ajustar si la fecha de cumpleaños aún no ha ocurrido este año
          if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
            edad--;
          }

          return edad >= 18 || "El dueño debe ser mayor de 18 años";
        }*/
      }
    );

    fetchBarrios("")

  }, [register]);

  const fetchBarrios = async (pattern) => {
    try {
      const data = await provinciaService.getBarriosCba(pattern);
      const barriosObtenidos = data.features.map(b => b.attributes.nombre);
      setBarrios(barriosObtenidos);
    } catch (error) {
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

  const onSubmit  = async (data) => {
    const nuevoVeterinario = {
      ...data,
      habilitado: true,
      domicilio: capitalizeWords(barrioSeleccionado) + ", " + data.calle + ", " + data.altura
    };

    nuevoVeterinario.fNacimiento = nuevoVeterinario.fNacimiento[0].toISOString().split("T")[0] + "T00:00:00";
    console.log(nuevoVeterinario)

    try {
      await veterinarioService.Grabar(nuevoVeterinario);
      Swal.fire({
        title: "¡Éxito!",
        text: "Veterinario registrado con éxito",
        icon: "success",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/modificar/veterinario");
      });
  
      navigate("/modificar/veterinario");
    } catch (error) {
      console.error("Error al registrar el veterinario:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">REGISTRO DE VETERINARIO</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="maven-pro-body">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Escriba su nombre"
            {...register('nombre', { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre.message}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">Apellido</label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            placeholder="Escriba su apellido "
            {...register('apellido', { required: "El apellido es obligatorio" })}
          />
          {errors.apellido && <p style={{ color: 'red' }}>{errors.apellido.message}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            placeholder="Escriba su email "
            {...register('email', { 
              required: "El email es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "El formato del email es inválido"
              }
            })}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
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
        <div className="mb-3">
          <label htmlFor="matricula" className="form-label">Matricula</label>
          <input
            type="number"
            className="form-control"
            id="matricula"
            placeholder="Escriba su matricula "
            {...register('matricula', { 
              required: "La matricula es obligatoria", 
              setValueAs: value => parseInt(value, 10),
              validate: value => value > 0 || "La matricula debe ser mayor que 0"
            })}
          />
          {errors.matricula && <p style={{ color: 'red' }}>{errors.matricula.message}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="number"
            className="form-control"
            id="telefono"
            placeholder="Escriba su telefono "
            {...register('telefono', { 
              required: "El telefono es obligatorio",
              minLength: {
                value: 10,
                message: "El teléfono debe tener al menos 10 dígitos"
              },
              pattern: {
                  value: /^[0-9]*$/,
                  message: "El teléfono solo puede contener números"
              }, 
              validate: value => value > 0 || "El telefono debe ser mayor que 0"
            })}
          />
          {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono.message}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="dni" className="form-label">DNI</label>
          <input
            type="number"
            className="form-control"
            id="dni"
            placeholder="Escriba su dni "
            {...register('dni', { 
              required: "El DNI es obligatorio", 
              minLength: {
                value: 8,
                message: "El DNI debe tener exactamente 8 dígitos"
                },
                maxLength: {
                    value: 8,
                    message: "El DNI debe tener exactamente 8 dígitos"
                },
                pattern: {
                    value: /^[0-9]*$/,
                    message: "El DNI solo puede contener números"
                },
              validate: value => value > 0 || "El DNI debe ser mayor que 0"
            })}
          />
          {errors.dni && <p style={{ color: 'red' }}>{errors.dni.message}</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">Fecha de nacimiento</label>
          <Flatpickr
            onChange={(date) => setValue('fNacimiento', date, { shouldValidate: true })}
            options={{ 
              altInput: true,
              altFormat: "F j, Y",
              dateFormat: "YYYY-mm-dd",
              locale: Spanish,
              maxDate: maxDate
            }}
            className="form-control"
            placeholder="Seleccione su fecha de nacimiento"
          />
          {errors.fNacimiento && <p style={{ color: 'red' }}>{errors.fNacimiento.message}</p>}
        </div>
        <div className="d-flex justify-content-end">
          <a href='/modificar/veterinario'>
              <button type='button' className="btn btn-secondary me-2 ms-auto confir2">Volver</button>
          </a>
          <button type="submit" className="btn btn-primary confir">Confirmar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroVeterinario;
