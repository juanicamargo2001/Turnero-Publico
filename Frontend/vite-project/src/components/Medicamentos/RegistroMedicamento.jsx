import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import medicamentosService from '../../services/medicamento/medicamentos.service';

const RegistroMedicamento = () => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue 
  } = useForm();
  
  const navigate = useNavigate();
  const [unidadesMedida, setUnidadesMedida] = useState([]); 

  useEffect(() => {
    // Obtener unidades de medida cuando el componente se monta
    fetchUnidadesMedida();
  }, []);

  const fetchUnidadesMedida = async () => {
    try {
      const data = await medicamentosService.obtenerUnidadesMedida();
      setUnidadesMedida(data);
    } catch (error) {
      console.error("Error al cargar las unidades de medida:", error);
    }
  };

  const onSubmit = async (data) => {
    // Solo enviamos nombre y descripcion
    const { nombre, descripcion } = data;

    try {
      await medicamentosService.crearMedicamento({ nombre, descripcion });
      alert("Medicamento registrado con éxito");
      navigate("/medicamentos");
    } catch (error) {
      console.error("Error al registrar el medicamento:", error.response ? error.response.data : error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">REGISTRO DE MEDICAMENTO</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="maven-pro-body">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Escriba el nombre del medicamento"
            {...register('nombre', { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            placeholder="Escriba la descripción del medicamento"
            {...register('descripcion', { required: "La descripción es obligatoria" })}
          />
          {errors.descripcion && <p style={{ color: 'red' }}>{errors.descripcion.message}</p>}
        </div>

        <div className="d-flex justify-content-end">
          <a href='/medicamentos'>
            <button type='button' className="btn btn-primary me-2 ms-auto confir">Volver</button>
          </a>
          <button type="submit" className="btn btn-primary confir">Confirmar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroMedicamento;