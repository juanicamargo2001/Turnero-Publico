import React from 'react'
import { useForm } from 'react-hook-form'
import { centroService } from '../../services/centro.service';
import { useState } from 'react';
import uploadImage from '../../imgs/upload2.png';

const Registro = () => {
    const {register, handleSubmit, formState: { errors } } = useForm();
    const {error, setError} = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);

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