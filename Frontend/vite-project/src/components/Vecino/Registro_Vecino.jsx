import React, { useState } from 'react';
import { set, useForm } from 'react-hook-form';
import Paso2Visual from './Paso2';
import Paso3Visual from './Paso3';
import { useStepForm } from './useStepForm';
import Paso1Visual from './Paso1';

const RegistroDatos = () => {
  const { currentStep, nextStep, prevStep } = useStepForm();
  const [formData, setFormData] = useState({
    dni: null,
    nombre: "",
    apellido: "",
    f_Nacimiento: "",
    domicilio: false,
    email: "",
    telefono: null
  });

  //const { register, handleSubmit, formState: { errors } } = useForm();

  const updateFormData = (data) => {
    // Actualiza el estado de formData combinando los datos nuevos
    setFormData(prevData => {
      const updatedData = { ...prevData, ...data };
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
          <Paso3Visual
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
      </div>
    </div>
  );
};

export default RegistroDatos;

