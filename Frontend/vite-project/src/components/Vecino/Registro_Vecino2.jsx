import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Paso2Visual from './Paso2';
import { useStepForm } from './useStepForm';
import Paso1Visual from './Paso1';

const RegistroDatos = () => {
  const { currentStep, nextStep, prevStep } = useStepForm();
  const [formData, setFormData] = useState({
    dni: null,
    nombre: "",
    apellido: "",
    fNacimiento: "",
    domicilio: "",
    email: "",
    telefono: null
  });

  //const { register, handleSubmit, formState: { errors } } = useForm();

  const updateFormData = (data) => {
    // Actualiza el estado de formData combinando los datos nuevos
    setFormData(prevData => {
      const updatedData = { ...prevData, ...data };
      console.log('formActualizado: ', updatedData);
      return updatedData; 
    });
  };  

  return (
    <div className="container mt-4">
      <div className="w-100">
        <div className="progress mb-4">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${(currentStep / 3) * 100}%`, backgroundColor:'#009EE2'}}
            aria-valuenow={currentStep}
            aria-valuemin="1"
            aria-valuemax="3"
          />
        </div>

        {/* Renderizado del paso 1: Datos Personales */}
        {currentStep === 1 && (
          <Paso1Visual
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}

        {/* Renderizado del paso 2: Datos de Contacto */}
        {currentStep === 2 && (
          <Paso2Visual
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}

        {/* Renderizado del paso 3: Datos de Cuenta */}
        {currentStep === 3 && (
          <div>
            <h2 className="maven-pro-title">DATOS DE CUENTA</h2>
            <form className="maven-pro-body" onSubmit={()=>{}}>
              {/*ACA VA LA PARTE DE EL USUARIO QUE VA EN OTRA SPRINT*/}
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

