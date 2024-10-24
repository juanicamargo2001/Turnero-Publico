import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";
import uploadImage from '../../imgs/upload2.png';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

const RegistroDatos = () => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showOtherOption, setShowOtherOption] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState('');
  const codeReader = new BrowserMultiFormatReader();

  const handleOtherOptionClick = () => {
    setShowOtherOption(!showOtherOption);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageElement = document.createElement('img');
      imageElement.src = URL.createObjectURL(file);

      imageElement.onload = () => {
        codeReader.decodeFromImage(imageElement)
          .then(result => {
            setScanResult(result.text);
          })
          .catch(err => {
            if (err instanceof NotFoundException) {
              console.log('No se encontró ningún código en la imagen.');
            } else {
              console.error('Error al decodificar la imagen:', err);
            }
          });
      };
    }
  };

  const handleScanData = (e) => {
    console.log(scanResult);
    if (scanResult===''){
      alert("Debe subir un archivo");
    } else {
      handleOtherOptionClick();
    }
  }

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
            {showOtherOption ? (
              <div>
                <h3>Registro automático con DNI</h3>
                <label htmlFor="docPrimerPic" className="form-label">Sube una foto del FRENTE de tu documento</label>
                <div className='upload-container mb-3'>
                    {selectedFile ? (
                        <div className="mb-3">
                            <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="preview"
                            className="img-thumbnail"
                            style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                            />
                        </div>
                    ) : (
                        <div className="mb-3">
                          <img
                            src={uploadImage}
                            alt="subir archivo"
                            style={{ width: '200px', height: '150px' }}
                          />
                        </div>
                    )}
                    <input
                        className='form-control'
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary confir" onClick={handleOtherOptionClick}>
                    Volver
                  </button>
                  <button type="submit" className="btn btn-success ms-auto confir" onClick={handleScanData}>
                    Continuar
                  </button>
                </div>
              </div>
            ) : (
            <div>
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary btn-lg d-flex align-items-center" onClick={handleOtherOptionClick}>
                    <span className="me-2">Registro automático con DNI</span>
                    <img src="path/to/your/image.png" alt="Icono" style={{ width: '30px', height: '30px' }} />
                </button>
            </div>
            <form className="maven-pro-body" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="dni" className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  id="dni"
                  placeholder={scanResult.split("@")[4] || "Escriba su DNI"}
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
                  placeholder={scanResult.split("@")[2] || "Escriba su nombre"}
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
                  placeholder={scanResult.split("@")[1] || "Escriba su apellido"}
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
                    placeholder={scanResult.split("@")[6] || "Seleccione fecha"}
                />
                {errors.fNacimiento && <p style={{ color: 'red' }}>{errors.fNacimiento.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="domicilio" className="form-label">Domicilio</label>
                <input
                  type="text"
                  className="form-control"
                  id="domicilio"
                  placeholder="VERIFICAR DOMICILIO CORDOBÉS"
                  readOnly 
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

