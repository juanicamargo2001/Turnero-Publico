import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";
import uploadImage from '../../imgs/upload2.png';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { vecinoService } from '../../services/vecino.service';

const Paso1Visual = ({ formData, updateFormData, nextStep})=> {
    const codeReader = new BrowserMultiFormatReader();
    const [showOtherOption, setShowOtherOption] = useState(false);
    const [showOtherOption2, setShowOtherOption2] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [scanResult, setScanResult] = useState('');
    const [selectedFile2, setSelectedFile2] = useState(null);

    const handleFileChange2 = (event) => {
        setSelectedFile2(event.target.files[0]);
    };

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        // Establece cada valor del formData en el formulario
        for (const key in formData) {
            setValue(key, formData[key]);
        }
    }, [formData, setValue]);

    const onFormSubmit = (data) => {
        if (!formData.domicilio) {return;}
        updateFormData(data);
        nextStep();
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

    const armarJson = (string) => {
        const partes = string.split('@')
        const jsonObject = {
            nombre: partes[2],
            apellido: partes[1],
            dni: parseInt(partes[4]),
            fNacimiento: partes[6]
        };
        return jsonObject;
    }

    const handleScanData = (e) => {
        if (scanResult===''){
            alert("Debe subir un archivo");
        } else {
            const data = armarJson(scanResult);
            updateFormData(data);
            handleOtherOptionClick();
        }
    }
    
    const handleOtherOptionClick = () => {
        setShowOtherOption(!showOtherOption);
    };

    const handleOtherOptionClick2 = () => {
      setShowOtherOption2(!showOtherOption2);
    };

    const handleDomicilioFoto = async ()=> {
      if (selectedFile2===null){
        alert("Debe subir un archivo");
      } else {
        try {
          const base64Image = await convertImageToBase64(selectedFile2);
          try {
            const response = await vecinoService.ProcesarImagen(base64Image);
            console.log(response);
            alert("Imagen procesada con exito");
            updateFormData({domicilio: true});
            handleOtherOptionClick2();
          } catch (error) {
            alert("Error al procesar imagen. Por favor, inténtelo de nuevo.");
            console.error("Error al procesar imagen:", error.response ? error.response.data : error); 
          }
        } catch (error) {
          console.error("Error al convertir la imagen:", error);
        }
      }
    }

    function convertImageToBase64(file) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
      });
    }

    return(
        <div>
            <h2 className="maven-pro-title">INGRESAR DATOS PERSONALES</h2>
            {showOtherOption &&(
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
            )}
            {!showOtherOption&&!showOtherOption2 &&(
            <div>
            <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary btn-lg d-flex align-items-center" onClick={handleOtherOptionClick}>
                    <span className="me-2">Registro automático con DNI</span>
                    <img src="path/to/your/image.png" alt="Icono" style={{ width: '30px', height: '30px' }} />
                </button>
            </div>
            <form className="maven-pro-body" onSubmit={handleSubmit(onFormSubmit)}>
              <div className="mb-3">
                <label htmlFor="dni" className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  id="dni"
                  placeholder={scanResult.split("@")[4] || "Escriba su DNI"}
                  defaultValue={formData.dni}
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
                  defaultValue={formData.nombre}
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
                  placeholder={"Escriba su apellido"}
                  defaultValue={formData.apellido}
                  {...register('apellido', { required: 'El apellido es obligatorio' })}                  
                />
                {errors.apellido && <p style={{ color: 'red' }}>{errors.apellido.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="fecha" className="form-label">Fecha de nacimiento</label>
                <Flatpickr
                    //onChange={(date) => setValue('fNacimiento', date, { shouldValidate: true })}
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
                <div>
                    {formData.domicilio ? (
                        <p style={{ color: 'green' }}>Domicilio verificado</p>
                    ) : (
                        <p style={{ color: 'red' }}>Domicilio no verificado</p>
                    )}
                </div>
                {errors.domicilio && <p style={{ color: 'red' }}>{errors.domicilio.message}</p>}
              </div>
              <div className="d-flex mt-3">
                <button className="btn btn-primary btn-lg d-flex align-items-center" onClick={handleOtherOptionClick2}>
                    <span className="me-2">Verificar domicilio con DNI</span>
                </button>
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-success ms-auto confir">
                  Continuar
                </button>
              </div>
            </form>
            </div>
            )}

            {showOtherOption2 &&(
              <div>
                <label htmlFor="docSegundaPic" className="form-label">Sube una foto del DORSO del documento</label>
                <div className='upload-container mb-3'>
                    {selectedFile2 ? (
                        <div className="mb-3">
                            <img
                            src={URL.createObjectURL(selectedFile2)}
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
                        class='form-control'
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleFileChange2}
                    />
                </div>
                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary confir" onClick={handleOtherOptionClick2}>
                    Volver
                  </button>
                  <button type="submit" className="btn btn-success ms-auto confir" onClick={handleDomicilioFoto}>
                    Continuar
                  </button>
                </div>
              </div>
            )}
        </div>
    )
}

export default Paso1Visual