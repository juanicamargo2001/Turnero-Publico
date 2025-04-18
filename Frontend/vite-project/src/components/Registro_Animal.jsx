import { useState, useEffect, useRef  } from 'react';
import mascotaService from '../services/animal/mascota.service';
import { sexosService } from '../services/animal/sexo.service';
import { tamanoService } from '../services/animal/tamano.service';
import { tipoAnimalService } from '../services/animal/tipoAnimal.service';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const RegistroAnimal = () => {
  const [sexos, setSexos] = useState([]);
  const [tamanos, setTamanos] = useState([]);
  const [tiposAnimal, setTiposAnimal] = useState([]);
  const [error, setError] = useState(null);
  const [razas, setRazas] = useState([]);
  const [query, setQuery] = useState('');
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const refContenedor = useRef(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
    mode: 'onChange',
  });

  const HandleRaza = async(e) => {

    setQuery(e.target.value)

    if (query.length > 2){

      let razas = await mascotaService.obtenerRazas(watch('tipoAnimal'), query)

      if (razas != null){
        setMostrarOpciones(true);
        setRazas(razas.result)
      }
    }
    else{
      setRazas([])
      setMostrarOpciones(false);
    }

  }

  const handleSelect = (raza) => {
    setValue('raza', raza.nombreRaza);
    setMostrarOpciones(false);
  };

  const onSubmit = async (data) => {
    const nuevaMascota = {
      edad: parseInt(data.edad),
      nombre: data.nombre,
      descripcion: data.descripcion,
      sexo: data.sexo,
      tipoAnimal: data.tipoAnimal,
      tamaño: data.tamano,
      raza: data.raza
    };
  
    try {
      await mascotaService.grabar(nuevaMascota);
      Swal.fire({
              title: "¡Éxito!",
              text: "La mascota fue registrada con éxito.",
              icon: "success",
              confirmButtonColor: "#E15562",
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/turno")
          });
      Object.keys(data).forEach((key) => {
        if (key !== 'edad') {
          data[key] = ''; 
        }
      });
    } catch (error) {
      setError("Error al registrar la mascota. Por favor, inténtelo de nuevo!");
      console.error("Error al registrar la mascota:", error.response ? error.response.data : error);
    }
  };

  useEffect(() => {
    const fetchSexos = async () => {
      try {
        const data = await sexosService.Buscar();
        setSexos(data.result);
      } catch {
        setError("Error al cargar los sexos");
      }
    };

    const fetchTamanos = async () => {
      try {
        const data = await tamanoService.Buscar();
        setTamanos(data.result);
      } catch {
        setError("Error al cargar los tamaños");
      }
    };

    const fetchTiposAnimal = async () => {
      try {
        const data = await tipoAnimalService.Buscar();
        setTiposAnimal(data.result);
      } catch {
        setError("Error al cargar los tipos de animales");
      }
    };

    fetchSexos();
    fetchTamanos();
    fetchTiposAnimal();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refContenedor.current && !refContenedor.current.contains(event.target)) {
        setMostrarOpciones(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  return (
    <div className="container mt-4">
       <h2 className="maven-pro-title">INGRESAR DATOS DE ANIMAL</h2>
       <form onSubmit={handleSubmit(onSubmit)} className="maven-pro-body">
         <div className="mb-3">
           <label htmlFor="nombre" className="form-label">Nombre</label>
           <input
            type="text"
            className="form-control"
            id="nombre"
            placeholder="Escriba el nombre del animal (opcional)"
            {...register('nombre')}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tipoAnimal" className="form-label">Tipo de Animal</label>
          <select
            className={`form-select ${errors.tipoAnimal ? 'is-invalid' : ''}`} 
            id="tipoAnimal"
            defaultValue=""
            {...register('tipoAnimal', { required: 'El tipo de animal es requerido' })} 
          >
            <option value="" disabled>Seleccionar Tipo de animal</option>
            {tiposAnimal.map((tipo) => (
              <option key={tipo.idTipo} value={tipo.tipoAnimal}>
                {tipo.tipoAnimal}
              </option>
            ))}
          </select>
          {errors.tipoAnimal && <div className="invalid-feedback">{errors.tipoAnimal.message}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            rows="2"
            placeholder="Escriba una descripción (opcional)"
            {...register('descripcion')}
          />
        </div>
        <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="edad" className="form-label">Edad</label>
          <input
            type="text"
            className={`form-control ${errors.edad ? 'is-invalid' : ''}`} 
            id="edad"
            placeholder="Ingrese la edad aproximada"
            {...register('edad', {
              required: 'La edad es requerida',
              max: {
                value: 20,
                message: 'La edad no puede ser mayor a 20 años',
              },
              min: {
                value: 0,
                message: 'La edad no puede ser negativa'
              }
            })}
          />
          {errors.edad && <div className="invalid-feedback">{errors.edad.message}</div>} 
        </div>
        <div className="col-md-6" ref={refContenedor}>
           <label htmlFor="raza" className="form-label">Raza</label>
           <input
            type="text"
            className="form-control"
            id="raza"
            placeholder="Escriba la raza del animal"
            {...register('raza')}
            onChange={HandleRaza}
          />
          {mostrarOpciones && razas.length > 0 && (
        <ul className="list-group position-absolute w-100 zindex-dropdown" style={{ maxHeight: '150px', overflowY: 'auto', maxWidth: '490px' }}>
          {razas.map((raza, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(raza)}
              style={{ cursor: 'pointer' }}
            >
              {raza.nombreRaza}
            </li>
          ))}
        </ul>
      )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="sexo" className="form-label">Sexo</label>
          <select
            className={`form-select ${errors.sexo ? 'is-invalid' : ''}`} 
            id="sexo"
            defaultValue="" 
            {...register('sexo', { required: 'El sexo es requerido' })} 
          >
            <option value="" disabled>Seleccionar sexo</option>
            {sexos.map(sexo => (
              <option key={sexo.idSexos} value={sexo.sexoTipo}>
                {sexo.sexoTipo}
              </option>
            ))}
          </select>
          {errors.sexo && <div className="invalid-feedback">{errors.sexo.message}</div>} 
        </div>
        <div className="col-md-6">
          <label htmlFor="tamano" className="form-label">Tamaño</label>
          <select
            className={`form-select ${errors.tamano ? 'is-invalid' : ''}`}
            id="tamano"
            defaultValue="" 
            {...register('tamano', { required: 'El tamaño es requerido' })} 
          >
            <option value="" disabled>Seleccionar tamaño</option>
            {tamanos.map((tamano) => (
              <option key={tamano.idTamaño} value={tamano.tamañoTipo}>
                {tamano.tamañoTipo}
              </option>
            ))}
          </select>
          {errors.tamano && <div className="invalid-feedback">{errors.tamano.message}</div>} 
        </div>
      </div>


        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroAnimal;
