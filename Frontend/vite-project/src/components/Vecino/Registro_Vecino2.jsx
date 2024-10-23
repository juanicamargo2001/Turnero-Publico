import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";

const RegistroDatos = () => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    nextStep();
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="container mt-4">
      <div className="w-100">
        <div className="progress mb-4">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${(step / 3) * 100}%`, backgroundColor:'#009EE2'}}
            aria-valuenow={step}
            aria-valuemin="1"
            aria-valuemax="3"
          />
        </div>

        {/* Renderizado del paso 1: Datos Personales */}
        {step === 1 && (
          <div>
            <h2 className="maven-pro-title">INGRESAR DATOS PERSONALES</h2>
            <form className="maven-pro-body" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="dni" className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  id="dni"
                  placeholder="123456789"
                  {...register('dni', { required: 'El DNI es obligatorio' })}
                />
                {errors.dni && <p style={{ color: 'red' }}>{errors.dni.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder="Andrew"
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                />
                {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="apellido" className="form-label">Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  placeholder="Andrew"
                  {...register('apellido', { required: 'El apellido es obligatorio' })}
                />
                {errors.apellido && <p style={{ color: 'red' }}>{errors.apellido.message}</p>}
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
                    }}
                    className="form-control"
                    placeholder="Seleccione su fecha de nacimiento"
                />
                {errors.fNacimiento && <p style={{ color: 'red' }}>{errors.fNacimiento.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="domicilio" className="form-label">Domicilio</label>
                <input
                  type="text"
                  className="form-control"
                  id="domicilio"
                  placeholder="Av. Sarmiento 1022, Córdoba"
                  {...register('domicilio', { required: 'El domicilio es obligatorio' })}
                />
                {errors.domicilio && <p style={{ color: 'red' }}>{errors.domicilio.message}</p>}
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success ms-auto confir">
                  Continuar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Renderizado del paso 2: Datos de Contacto */}
        {step === 2 && (
          <div>
            <h2 className="maven-pro-title">DATOS DE CONTACTO</h2>
            <form className="maven-pro-body" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Escriba su email"
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'El formato del email es inválido'
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
                  placeholder="Escriba su teléfono"
                  {...register('telefono', {
                    required: 'El teléfono es obligatorio',
                    setValueAs: value => parseInt(value, 10),
                  })}
                />
                {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono.message}</p>}
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary confir"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  Volver
                </button>
                <button type="submit" className="btn btn-success ms-auto confir">
                  Continuar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Renderizado del paso 3: Datos de Cuenta */}
        {step === 3 && (
          <div>
            <h2 className="maven-pro-title">DATOS DE CUENTA</h2>
            <form className="maven-pro-body" onSubmit={handleSubmit(onSubmit)}>
              {/* Aquí puedes agregar los campos correspondientes a este paso */}
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary confir"
                  onClick={prevStep}
                >
                  Volver
                </button>
                <button type="submit" className="btn btn-success confir">
                  Finalizar
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistroDatos;

