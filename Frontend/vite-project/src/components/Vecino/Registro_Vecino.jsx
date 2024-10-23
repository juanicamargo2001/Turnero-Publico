import React from 'react'
import { useForm } from 'react-hook-form'
import { centroService } from '../../services/centro.service';
import { useState } from 'react';
import uploadImage from '../../imgs/upload2.png';

const Registro = () => {
    const {register, handleSubmit, formState: { errors } } = useForm();
    const {error, setError} = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileChange2 = (event) => {
        setSelectedFile2(event.target.files[0]);
    };

    const onSubmit = async (data) =>{
        const nuevoCentro = {
            nombre: data.nombre,
            barrio: data.barrio,
            calle: data.calle,
            altura: parseInt(data.altura),
            habilitado: true
        }
        try {
            await centroService.Grabar(nuevoCentro);
            alert("Centro registrado con exito!")
        } catch (error) {
            setError("Error al registrar el centro. Por favor, inténtelo de nuevo.");
            console.error("Error al registrar el centro:", error.response ? error.response.data : error); 
        }
    }

  return (
    <div className='container mt-4'>
        <h2 className='maven-pro-title'>INGRESAR DATOS PERSONALES</h2>
        <form className='maven-pro-body' onSubmit={handleSubmit(onSubmit)}>
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
        <label htmlFor="telefono" className="form-label">Telefono</label>
          <input
            type="number"
            className="form-control"
            id="telefono"
            placeholder="Escriba su telefono "
            {...register('telefono', { 
              required: "El telefono es obligatorio", 
              setValueAs: value => parseInt(value, 10)
            })}
          />
          {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono.message}</p>}
        </div> 
        <label htmlFor="docPrimerPic" className="form-label">Sube una foto del FRENTE del documento</label>
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
          <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>
        </form>
    </div>
  )
}

export default Registro;