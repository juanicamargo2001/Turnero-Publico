import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { vecinoService } from "../../services/vecino/vecino.service";
import Swal from 'sweetalert2';

export default function Registro_Vecino_Minimo() {

  const {register, handleSubmit, formState: { errors }, setValue} = useForm({
    mode: 'onSubmit',
    defaultValues: {
      f_Nacimiento: null,
    }
  });

  const navigate = useNavigate()
  const today = new Date();
  const maxDate = new Date(today.getTime() - (6575 * 24 * 60 * 60 * 1000)); 

  useEffect(() => {
    register('f_Nacimiento', { 
      required: "La fecha de nacimiento es obligatoria"
      }
    );
  }, [register]);

  const onSubmit = async (data) => {
    data.f_Nacimiento = data.f_Nacimiento[0].toISOString().split("T")[0] + "T00:00:00";
    data.dni = parseInt(data.dni)
    data.telefono = parseInt(data.telefono)
    console.log(data)

    try{
      await vecinoService.GrabarVecinoMinimo(data)
      Swal.fire({
        title: "¡Éxito!",
        text: "Vecino registrado con exito",
        icon: "success",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      });
      navigate(-1)
    }catch(error){
      console.error("Error al registrar el vecino:", error.response ? error.response.data : error);
    }
    
  }

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">Registrar Vecino</h2>
      <h5 className="pb-3">Ingrese los siguientes campos</h5>
      <form className="maven-pro-body" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Escribe el nombre"
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
            placeholder="Escribe el apellido "
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
            placeholder="Escribe el email "
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
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="number"
            className="form-control"
            id="telefono"
            placeholder="Escribe el telefono "
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
            placeholder="Escribe el dni "
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
                    options={{ 
                    altInput: true,
                    altFormat: "F j, Y",
                    dateFormat: "Y-m-d",
                    locale: Spanish,
                    maxDate: maxDate,
                    }}
                    id="fNacimiento"
                    className="form-control"
                    placeholder={"Seleccione fecha"}
                    onChange={(date) => setValue('f_Nacimiento', date, { shouldValidate: true })}
                    //{...register('f_Nacimiento', { required: 'La fecha de nacimiento es obligatoria' })}
                />
                {errors.fNacimiento && <p style={{ color: 'red' }}>{errors.fNacimiento.message}</p>}
              </div>
        <div className="d-flex justify-content-end p-2">
          <button type="button" className="btn btn-secondary me-2 confir2" onClick={() => navigate(-1)}>Volver</button>
          <button type="submit" className="btn btn-success confir">Confirmar</button>
        </div>
      </form>
    </div>
  )
}
