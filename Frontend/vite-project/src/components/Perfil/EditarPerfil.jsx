import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { vecinoService } from '../../services/vecino/vecino.service'
import { provinciaService } from '../../services/provincia/provincia.service'
import './Perfil.css'
import Swal from 'sweetalert2';

export default function EditarPerfil() {
    const { register, handleSubmit, watch, formState: { errors }, setValue} = useForm({ mode: 'onChange' })
    const [perfil, setPerfil] = useState(null)
    const [barrios, setBarrios] = useState([]); 
    const [sugerencias, setSugerencias] = useState([]); 
    const [barrioSeleccionado, setBarrioSeleccionado] = useState(""); 
    
    const fetchPerfil = async () =>{
        try {
            const dataPerfil = await vecinoService.ObtenerPerfil()
            const perfilCargado = dataPerfil.result;

            //Aca divido el domicilio en barrio, calle y altura para setearlos default en el form
            const [barrio, calle, altura] = (perfilCargado.domicilio || "").split(',').map(part => part.trim());
            setBarrioSeleccionado(barrio)

            // Solo seteo los valores que se pueden modificar en el form (el nombre, apellido y fecha nacimiento estan en el perfil)
            setValue('email', perfilCargado.email || "Sin email");
            setValue('telefono', perfilCargado.telefono || "");
            setValue('barrio', barrio || ""); 
            setValue('calle', calle || "");   
            setValue('altura', altura || "");

            setPerfil(perfilCargado)

        } catch {
            console.log("Error al cargar el perfil")
        }
    }

    const fetchBarrios = async (pattern) => {
        try {
          const data = await provinciaService.getBarriosCba(pattern);
          const barriosObtenidos = data.features.map(b => b.attributes.nombre);
          setBarrios(barriosObtenidos);
        } catch {
          console.error("Error al cargar los barrios. Por favor, inténtelo de nuevo.")
        }
      };
    
      const handleBarrioInput = (e) => {
        const valor = e.target.value;
        setBarrioSeleccionado(valor);
        setValue('barrio', valor)
    
        if (valor.length >= 3) {
          fetchBarrios(valor.toUpperCase())
          setSugerencias(barrios);
        } else {
          setSugerencias([]);
        }
      };
    
      const seleccionarBarrio = (barrio) => {
        setBarrioSeleccionado(barrio);
        setValue('barrio', barrio)
        setSugerencias([]);
      };
    
      const capitalizeWords = (text) => {
        return text
          .toLowerCase() // Convertimos todo a minúsculas
          .split(" ")    // Dividimos el texto en palabras
          .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalizamos la primera letra
          .join(" ");    // Unimos las palabras nuevamente
      };    

    const onSubmit = async (data) =>{

      let nuevoDomicilio

      if(!data.barrio || !data.calle){
        // Swal.fire({
        //   text: "Ingrese un barrio o una calle",
        //   icon: "info",
        //   confirmButtonColor: "#E15562",
        //   confirmButtonText: "OK",
        // });
      }else{
        nuevoDomicilio = `${capitalizeWords(data.barrio)}, ${data.calle}, ${data.altura}`
      }
      
      const datosVecino = {
        domicilio: nuevoDomicilio,
        email: data.email,
        telefono: data.telefono
      }

      try {
        await vecinoService.EditarVecino(datosVecino);
        Swal.fire({
                title: "¡Éxito!",
                text: "Datos del vecino modificados con éxito.",
                icon: "success",
                confirmButtonColor: "#E15562",
                confirmButtonText: "OK",
              });
        return
      } catch (error) {
        console.error("Error al modificar los datos del vecino:", error.response ? error.response.data : error);
      }      
    }

    useEffect(() => {
        fetchPerfil()
    },[])

    if (perfil === null) return <div>Cargando...</div>;
    
  return (
    <div className="container mt-4 page-container">
        <h3 className='titulo-form' >Editar perfil</h3>
        <form onSubmit={handleSubmit(onSubmit)} className='formulario-editar'>
        <div className='seccion'>
          <h5>Personal</h5>
            <div className='campo-nombre-apellido'>
              <div className='campo'>
              <label htmlFor="nombre" className="form-label" style={{fontSize: "0.96rem"}}>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  id="nombre"
                  value={perfil.nombre}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', color: '#6c757d', cursor: 'not-allowed' }}
                />
              </div>

              <div className="campo">
                <label htmlFor="apellido" className="form-label" style={{fontSize: "0.96rem"}}>Apellido</label>
                <input
                  type="text"
                  className="form-control"
                  id="apellido"
                  value={perfil.apellido}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0', color: '#6c757d', cursor: 'not-allowed' }}
                />
              </div>
          </div>

          <div className="campo">
            <label htmlFor="f_nacimiento" className="form-label" style={{fontSize: "0.96rem"}}>Fecha de nacimiento</label>
            <input
              type="text"
              className="form-control"
              id="f_nacimiento"
              value={
                perfil?.f_nacimiento
                  ? new Date(perfil.f_nacimiento).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : "Sin fecha"
              }
              readOnly
              style={{ backgroundColor: '#f0f0f0', color: '#6c757d', cursor: 'not-allowed' }}
            />
          </div>

          <div className='campo'>
              <label htmlFor="barrio" className="form-label" style={{fontSize: "0.96rem"}}>Barrio</label>
              <input
                type="text"
                className={`form-control ${errors.barrio ? "is-invalid" : ""}`}
                id="barrio"
                value={barrioSeleccionado}
                onChange={handleBarrioInput} 
              />
              {errors.barrio && <div className="invalid-feedback">{errors.barrio.message}</div>}
              <div className="autocomplete-list w-50">
                {sugerencias.map((barrio, index) => (
                  <div
                    key={index}
                    className="autocomplete-item"
                    onClick={() => seleccionarBarrio(barrio)}
                  >
                    {capitalizeWords(barrio)}
                  </div>
                ))}
              </div>
          </div> 
          <div className="campo">
              <label htmlFor="calle" className='form-label' style={{fontSize: "0.96rem"}}>Calle</label>
              <input
              type="text"
              className={`form-control ${errors.calle ? "is-invalid" : ""}`}
              id="calle"
              {...register("calle", {
                validate: value =>
                  !barrioSeleccionado || value.trim() !== "" || "Debe ingresar una calle si ha seleccionado un barrio"
              })}
              />
              {errors.calle && <div className="invalid-feedback">{errors.calle.message}</div>}
          </div>
          <div className="campo">
              <label htmlFor="altura" className="form-label" style={{fontSize: "0.96rem"}}>Altura</label>
              <input
                type="text"
                className={`form-control ${errors.altura ? "is-invalid" : ""}`}
                id="altura"
                {...register("altura", {
                  valueAsNumber: true,
                  validate: value =>
                    !watch("calle") || (value > -1 && value !== "") || "Debe ingresar una altura valida"
                })}
              />
              {errors.altura && <div className="invalid-feedback">{errors.altura.message}</div>}
          </div>
        </div>
        
        <div className='seccion'>
          <h5>Contacto</h5>
          <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{fontSize: "0.96rem"}}>Email</label>
            <input
              type="text"
              className="form-control"
              id="email"
              {...register('email', { 
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "El formato del email es inválido"
                }
              })}
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label" style={{fontSize: "0.96rem"}}>Teléfono</label>
            <input
              type="text"
              className="form-control"
              id="telefono"
              {...register('telefono', { 
                pattern: {
                    value: /^(?!0+$)(\+\d{1,3}[- ]?)?(?!0+$)\d{10,15}$/,
                    message: "El teléfono solo puede contener números y ademas debe tener 10 dígitos como mínimo"
                }, 
              })}
            />
            {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono.message}</p>}
            <div>
              <button style={{marginTop: "20px"}} type="submit" className="btn btn-guardar confir">Guardar</button>
            </div>  
          </div>
        </div>
        </form>
    </div>
  )
}
