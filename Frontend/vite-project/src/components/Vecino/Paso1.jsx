import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";
import uploadImage from '../../imgs/upload2.png';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { vecinoService } from '../../services/vecino/vecino.service';
import { useNavigate } from "react-router-dom";

const Paso1Visual = ({ formData, updateFormData, nextStep})=> {
    const codeReader = new BrowserMultiFormatReader();
    const [showOtherOption, setShowOtherOption] = useState(false);
    const [showOtherOption2, setShowOtherOption2] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [scanResult, setScanResult] = useState('');
    const [selectedFile2, setSelectedFile2] = useState(null);
    const today = new Date();
    const maxDate = new Date(today.getTime() - (6575 * 24 * 60 * 60 * 1000)); // Resta 6570 días o 18 años

    const handleFileChange2 = (event) => {
        setSelectedFile2(event.target.files[0]);
    };

    const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm();

    useEffect(() => {
        // Establece cada valor del formData en el formulario
        for (const key in formData) {
            setValue(key, formData[key]);
        }
        console.log(formData);
    }, [formData, setValue]);

    const onFormSubmit = (data) => {
        if (!formData.domicilio) {
          return;
        } else if (formData.domicilio===""){
          formData.domicilio = false;
          return
        }
        if (formData.f_Nacimiento===""){
          alert("Debe ingresar una fecha de nacimiento mayor a 18 años de edad");
          return;
        }
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

    const handleDateChange = (dat) => {
      //CONTROLAR FECHA
      /*const date = new Date(dat);
      const hoy = new Date();
      const edad = hoy.getFullYear() - date.getFullYear();
      const mes = hoy.getMonth() - date.getMonth();

      // Ajustar si la fecha de cumpleaños aún no ha ocurrido este año
      if (mes < 0 || (mes === 0 && hoy.getDate() < date.getDate())) {
        edad--;
      }

      if (edad>17) {
        clearErrors("fNacimiento");
        const fech = parsearFechaDate(dat[0]);
        updateFormData({f_Nacimiento: fech});
      } else {
        //clearErrors("fNacimiento");
        updateFormData({f_Nacimiento: ""});
        setError("fNacimiento", {
          type: "validate",
          message: "Debe ser mayor a 18 años",
        });
      }*/
        const fech = parsearFechaDate(dat[0]);
        updateFormData({f_Nacimiento: fech});
    };

    const parsearFechaDate = (f) => {
      const s = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
      return s;
    }
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      updateFormData({[e.target.id]: value});
    };

    const parsearFecha = (f) => {
      const s = f.split("/");
      const parse = s[2] + "-" + s[1] + "-" + s[0];
      return parse;
    }

    const armarJson = (string) => {
        const partes = string.split('@')
        const fechaParseada = parsearFecha(partes[6]);
        const jsonObject = {
            nombre: partes[2],
            apellido: partes[1],
            dni: parseInt(partes[4]),
            f_Nacimiento: fechaParseada
        };
        return jsonObject;
    }

    const handleScanData = (e) => {
        if (scanResult===''){
            alert("Debe subir un archivo correcto");
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
      /*updateFormData({
        dni: document.getElementById("dni").value, 
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value
      })*/
      setShowOtherOption2(!showOtherOption2);
    };

    const handleDomicilioFoto = async ()=> {
      if (selectedFile2===null){
        alert("Debe subir un archivo correcto");
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
    const navigate = useNavigate();

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
                <div className="d-flex justify-content-end p-2">
                  <button type="button" className="btn btn-secondary me-2 confir2" onClick={handleOtherOptionClick}>
                    Volver
                  </button>
                  <button type="submit" className="btn btn-success  confir" onClick={handleScanData}>
                    Continuar
                  </button>
                </div>
              </div>
            )}
            {!showOtherOption&&!showOtherOption2 &&(
            <div className="containerPaso1">
            <form className="maven-pro-body" onSubmit={handleSubmit(onFormSubmit)}>
              <div className="mb-3">
                <label htmlFor="dni" className="form-label">DNI</label>
                <input
                  type="text"
                  className="form-control"
                  id="dni"
                  placeholder={"Escriba su DNI"}
                  defaultValue={formData.dni}
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
                  onChange={handleInputChange}
                />
                {errors.dni && <p style={{ color: 'red' }}>{errors.dni.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  placeholder={"Escriba su nombre"}
                  defaultValue={formData.nombre}
                  {...register('nombre', { required: 'El nombre es obligatorio' })}     
                  onChange={handleInputChange}             
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
                  onChange={handleInputChange}               
                />
                {errors.apellido && <p style={{ color: 'red' }}>{errors.apellido.message}</p>}
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
                    value={formData.f_Nacimiento}
                    onChange={(date) => handleDateChange(date)}
                    //{...register('f_Nacimiento', { required: 'La fecha de nacimiento es obligatoria' })}
                />
                {errors.fNacimiento && <p style={{ color: 'red' }}>{errors.fNacimiento.message}</p>}
              </div>

              <div className="d-flex mt-3">
                <button className="btn btn-primary btn-lg d-flex align-items-center" onClick={handleOtherOptionClick2}>
                    <span className="me-2">Verificar domicilio con DNI</span>
                </button>
              </div>
              <div className="mb-3">
                <div>
                    {formData.domicilio === "" ? null : formData.domicilio ? (
                        <p style={{ color: 'green' }}>Domicilio verificado</p>
                    ) : (
                        <p style={{ color: 'red' }}>Domicilio no verificado</p>
                    )}
                </div>
                {errors.domicilio && <p style={{ color: 'red' }}>{errors.domicilio.message}</p>}
              </div>

              <div className="d-flex justify-content-end p-2">
                <button type="button" className="btn btn-secondary me-2 confir2" onClick={() => navigate("/")}>
                    Volver
                  </button>
                <button type="submit" className="btn btn-success confir">
                  Continuar
                </button>
              </div>
            </form>
            <div
                className="card-option maven-pro-body"
                onClick={handleOtherOptionClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleOtherOptionClick();
                }}
            >
              <h4>Otra opción de registro</h4>
              <div className="icon-container">
              <i class="far fa-address-card"></i>
              </div>
                <p>Subí una imagen del frente de tu DNI.</p>
            </div>


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
                <div className="d-flex justify-content-end p-2">
                  <button type="button" className="btn btn-secondary me-2 confir2" onClick={handleOtherOptionClick2}>
                    Volver
                  </button>
                  <button type="submit" className="btn btn-success confir" onClick={handleDomicilioFoto}>
                    Continuar
                  </button>
                </div>
              </div>
            )}
        </div>
    )
}

export default Paso1Visual