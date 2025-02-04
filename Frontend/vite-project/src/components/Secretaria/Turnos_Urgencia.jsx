import React from 'react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { vecinoService } from '../../services/vecino/vecino.service'
import { tipoAnimalService } from '../../services/animal/tipoAnimal.service'
import { sexosService } from '../../services/animal/sexo.service'
import { tamanoService } from '../../services/animal/tamano.service'
import { turnosService} from '../../services/turno/turnos.service'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';


export default function Turnos_Urgencia() {
  
  const { register, handleSubmit, formState: { errors }} = useForm({
    mode: 'onChange', 
  })

  const [busqueda, setBusqueda] = useState("")
  const [vecinos, setVecinos] = useState([])
  const [error, setError] = useState(null)
  const [showRegistro, setShowRegistro] = useState(false)
  const [dataForm, setDataForm] = useState("")
  const [sexos, setSexos] = useState([])
  const [tiposAnimal, setTiposAnimal] = useState([])
  const [tamanos, setTamanos] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null)
  const navigate = useNavigate()

  const manejarBusqueda = async (e) => {
    if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
      if (!busqueda) {
          setVecinos([]);
      } else {
          try {
            const response = await vecinoService.obtenerVecinoXDNI(busqueda)
            setVecinos([response.result])
          } catch (error) {
            alert("No se encontro a un vecino con ese DNI")
            setError(error);
            console.error("Error al buscar vecinos:", error);
            setVecinos([])
          }
      }}
  }

  const handleRegistro = () =>{
    if(selectedRow === null){
        Swal.fire({
              icon: "warning",
              text: `Debe seleccionar un vecino primero`,
              confirmButtonColor: "#E15562",
              confirmButtonText: "OK",
            });
        setShowRegistro(false)
      }
    else{
      setDataForm(selectedRow)
      setShowRegistro(true)
    }
  }

  const fetchSexos = async () => {
    try {
      const data = await sexosService.Buscar();
      setSexos(data.result);
    } catch (error) {
      setError("Error al cargar los sexos");
    }
  };

  const fetchTiposAnimal = async () => {
    try {
      const data = await tipoAnimalService.Buscar();
      setTiposAnimal(data.result);
    } catch (error) {
      setError("Error al cargar los tipos de animales");
    }
  };

  const fetchTamanos = async () => {
    try {
      const data = await tamanoService.Buscar();
      setTamanos(data.result);
    } catch (error) {
      setError("Error al cargar los tamaños");
    }
  };

  const onSubmit = async (data) => {
    const nuevoTurnoUrgencia = {
      idUsuario: parseInt(dataForm.idUsuario),
      edad: parseInt(data.edad),
      sexo: data.sexo,
      tipoAnimal: data.tipoAnimal,
      tipoTamaño: data.tamano
    };
    
    console.log(nuevoTurnoUrgencia)

    try {
      await turnosService.reservarTurnoUrgencia(nuevoTurnoUrgencia)
      Swal.fire({
              title: "¡Éxito!",
              text: "Turno de emergencia registrado con éxito.",
              icon: "success",
              confirmButtonColor: "#E15562",
              confirmButtonText: "OK",
            });
      navigate("/secretaria/turnos")
    } catch (error) {
      setError("Error al grabar el turno")
    }
    
  };

  useEffect(() => {
    fetchSexos()
    fetchTiposAnimal()
    fetchTamanos()
  }, [])

  return (
    <div className="container mt-4 page-container">
            <h2 className="maven-pro-title">Turnos de emergencia</h2>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
              <div className="input-group w-100 w-md-50 w-lg-25">
                <input 
                  type="number" 
                  className="form-control" 
                  placeholder="Ingrese DNI del vecino" 
                  aria-label="Buscar vecino"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={manejarBusqueda} 
                />
                <span className="input-group-text" onClick={manejarBusqueda} style={{ cursor: 'pointer' }}>
                  <i className="fa fa-search"></i>
                </span>
              </div>
            </div>
            <table className='table'>
                <thead>
                    <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Fecha de nacimiento</th>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Telefono</th>
                    <th>Seleccionar</th>
                    </tr>
                </thead>
                <tbody>
                    {vecinos.map((row, index) => (
                    <tr key={index}>
                        <td>{row.nombre}</td>
                        <td>{row.apellido}</td>
                        <td>{row.f_nacimiento}</td>
                        <td>{row.dni}</td>
                        <td>{row.email}</td>
                        <td>{row.telefono}</td>
                        <td>
                          <input
                            type='checkbox'
                            checked={selectedRow === row}
                            onChange={() => setSelectedRow(selectedRow === row ? null : row)}
                          />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div>   
            <button style={{marginRight: "10px"}}  type="button" onClick={() => handleRegistro()} className="btn btn-success confir" >Continuar</button>

            <button style={{width: "180px"}} type="button" onClick={() => navigate("/secretaria/registro-vecino-minimo")} className="btn btn-success confir">Registrar nuevo vecino</button>
            </div>  
            <div>
            {showRegistro === true &&(
               <div className="container mt-4">
               <h2 className="maven-pro-title">Registrar animal</h2>
               <form onSubmit={handleSubmit(onSubmit)} className="maven-pro-body">

               <div className="mb-3">
                  <label htmlFor="tipoAnimal" className="form-label">Tipo de Animal</label>
                  <select
                    className={`form-select ${errors.tipoAnimal ? 'is-invalid' : ''}`} 
                    id="tipoAnimal"
                    defaultValue="" 
                    {...register('tipoAnimal', { required: 'El tipo de animal es requerido' })} 
                  >
                    <option value="" disabled>Tipo Animal</option>
                    {tiposAnimal.map((tipo) => (
                      <option key={tipo.idTipo} value={tipo.tipoAnimal}>
                        {tipo.tipoAnimal}
                      </option>
                    ))}
                  </select>
                  {errors.tipoAnimal && <div className="invalid-feedback">{errors.tipoAnimal.message}</div>}
                </div>
        
                <div className="mb-3">
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

                <div className="mb-3">
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

              <div className="mb-3">
                  <label htmlFor="edad" className="form-label">Edad aproximada</label>
                  <input
                    type="number"
                    className={`form-control ${errors.edad ? 'is-invalid' : ''}`} 
                    id="edad"
                    placeholder="Ingrese la edad aproximada"
                    {...register('edad', {
                      required: 'La edad es requerida',
                      max: {
                        value: 20,
                        message: 'La edad no puede ser mayor a 20 años',
                      },
                      min:{
                        value: 0,
                        message: 'La edad no puede ser negativa'
                      }
                    })}
                  />
                  {errors.edad && <div className="invalid-feedback">{errors.edad.message}</div>} 
                </div>

                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary ms-auto confir">Confirmar</button>
                </div>

              </form>
            </div>
            )}
            </div>
    </div>
  )
}
