import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import medicamentosService from '../../services/medicamento/medicamentos.service';

const RegistroUnidadMedida = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors }
  } = useForm();
  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { nombre } = data;

    try {
      await medicamentosService.crearUnidadMedida(nombre);
      alert("Unidad de medida registrada con éxito");
      navigate("/unidades");
    } catch (error) {
      console.error("Error al registrar la unidad de medida:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">REGISTRO DE UNIDAD DE MEDIDA</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="maven-pro-body">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Escriba el nombre de la unidad de medida"
            {...register('nombre', { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre.message}</p>}
        </div>

        <div className="d-flex justify-content-end">
          <a href='/unidades-medida'>
            <button type='button' className="btn btn-primary me-2 ms-auto confir">Volver</button>
          </a>
          <button type="submit" className="btn btn-primary confir">Confirmar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroUnidadMedida;
