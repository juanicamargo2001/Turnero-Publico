import { useEffect, useState } from "react";
import gatoImg from "../../imgs/gato.png";
import perroImg from "../../imgs/perro.png";
import mascotaService from "../../services/animal/mascota.service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { sexosService } from "../../services/animal/sexo.service";
import { tipoAnimalService } from "../../services/animal/tipoAnimal.service";
import { tamanoService } from "../../services/animal/tamano.service";
import { DotLoader } from "react-spinners";
import { useForm } from "react-hook-form";

// setValue('email', perfilCargado.email || "Sin email");
// setValue('telefono', perfilCargado.telefono || "");
// setValue('barrio', barrio || ""); 
// setValue('calle', calle || "");   
// setValue('altura', altura || "");

const MisMascotas = () => {
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [mascotaEdit, setMascotaEdit] = useState(null);
  const [sexos, setSexo] = useState([]);
  const [tipoAnimales, setTiposAnimal] = useState([]);
  const [tamañoAnimales, setTamañosAnimales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({});

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchMascotas = async () => {
      let response = await mascotaService.obtenerTodasMisMascotas();
      setMascotas(response.result);
      setIsLoading(false);
    };

    fetchMascotas();
  }, []);

  const cargarDetalleAnimal = async () => {
    setIsLoading(true);
    let responseSexo = await sexosService.Buscar();
    setSexo(responseSexo.result);

    let responseTipoAnimal = await tipoAnimalService.Buscar();
    setTiposAnimal(responseTipoAnimal.result);

    let responseTamaño = await tamanoService.Buscar();
    setTamañosAnimales(responseTamaño.result);
    setIsLoading(false);
  };

  const handleMascotaSelect = (mascota) => {
    setSelectedMascota(mascota);
    console.log(mascota);
  };

  const onSubmit = async (data) => {
    const nuevaMascota = {
      idMascota: mascotaEdit.idMascota,
      edad: parseInt(data.edad),
      nombre: data.nombre,
      descripcion: data.descripcion,
      sexo: data.sexo,
      tipoAnimal: data.tipoAnimal,
      tamaño: data.tamano,
    };
    console.log(data);
    try {
      let response = await mascotaService.editarMascota(nuevaMascota);
      if (response != null)
        Swal.fire({
          text: "El animal se editó correctamente",
          icon: "success",
          confirmButtonColor: "#E15562",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
    } catch {
      Swal.fire({
        text: "Sucedió un error al editar",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/misMascotas");
      });
    }
  };

  return (
    <div className="container text-center mt-5 page-container">
      {isLoading && (
        <div className="loading-overlay">
          <DotLoader color="#60C1EA" />
        </div>
      )}
      <h1 className="mb-5 maven-pro-title">Lista de Animales</h1>
      {console.log(mascotaEdit)}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Editar Animal
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedMascota && (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="col-form-label">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      onChange={(e) =>
                        setMascotaEdit((prev) => ({
                          ...prev,
                          nombre: e.target.value,
                        }))
                      }
                      {...register("nombre")}
                      defaultValue={selectedMascota?.nombre}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="col-form-label">
                      Descripción
                    </label>
                    <textarea
                      className="form-control"
                      value={mascotaEdit?.descripcion || ""}
                      id="descripcion"
                      onChange={(e) =>
                        setMascotaEdit((prev) => ({
                          ...prev,
                          descripcion: e.target.value,
                        }))
                      }
                      {...register("descripcion")}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edad" className="col-form-label">
                      Edad
                    </label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.edad ? "is-invalid" : ""
                      }`}
                      value={mascotaEdit?.edad || ""}
                      id="edad"
                      onChange={(e) =>
                        setMascotaEdit((prev) => ({
                          ...prev,
                          edad: e.target.value,
                        }))
                      }
                      {...register("edad", {
                        required: "La edad es requerida",
                        max: {
                          value: 20,
                          message: "La edad no puede ser mayor a 20 años",
                        },
                        min: {
                          value: 0,
                          message: "La edad no puede ser negativa",
                        },
                      })}
                    />
                    {errors.edad && (
                      <div className="invalid-feedback">
                        {errors.edad.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sexo" className="col-form-label">
                      Sexo
                    </label>
                    <select
                      className={`form-select ${
                        errors.sexo ? "is-invalid" : ""
                      }`}
                      value={mascotaEdit?.sexo || ""}
                      id="sexo"
                      onChange={(e) =>
                        setMascotaEdit((prev) => ({
                          ...prev,
                          sexo: e.target.value,
                        }))
                      }
                      {...register("sexo", {
                        required: "El sexo es requerido",
                      })}
                    >
                      {sexos.map((sexo) => (
                        <option key={sexo.idSexos} value={sexo.sexoTipo}>
                          {sexo.sexoTipo}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.sexo && (
                    <div className="invalid-feedback">
                      {errors.sexo.message}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="tamano" className="col-form-label">
                      Tamaño
                    </label>
                    <select
                      className="form-control"
                      value={mascotaEdit?.tamaño || ""}
                      id="tamano"
                      onChange={(e) =>
                        setMascotaEdit((prev) => ({
                          ...prev,
                          tamaño: e.target.value,
                        }))
                      }
                      {...register("tamano", {
                        required: "El tamaño es requerido",
                      })}
                    >
                      {tamañoAnimales.map((tamaño) => (
                        <option key={tamaño.idTamaño} value={tamaño.tamañoTipo}>
                          {tamaño.tamañoTipo}
                        </option>
                      ))}
                    </select>
                    {errors.tamano && (
                      <div className="invalid-feedback">
                        {errors.tamano.message}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tipoAnimal" className="col-form-label">
                      Tipo de Animal
                    </label>
                    <select
                      className={`form-select ${
                        errors.tipoAnimal ? "is-invalid" : ""
                      }`}
                      value={mascotaEdit?.tipoAnimal || ""}
                      id="tipoAnimal"
                      onChange={(e) =>
                        setMascotaEdit((prev) => ({
                          ...prev,
                          tipoAnimal: e.target.value,
                        }))
                      }
                      {...register("tipoAnimal", {
                        required: "El tipo de animal es requerido",
                      })}
                    >
                      {tipoAnimales.map((tipoAnimal) => (
                        <option
                          key={tipoAnimal.idTipo}
                          value={tipoAnimal.tipoAnimal}
                        >
                          {tipoAnimal.tipoAnimal}
                        </option>
                      ))}
                    </select>
                    {errors.tipoAnimal && (
                      <div className="invalid-feedback">
                        {errors.tipoAnimal.message}
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ms-auto confir"
                    >
                      Confirmar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Animales */}
      <div
        className={`row ${
          mascotas.length === 1 ? "justify-content-center" : ""
        }`}
      >
        {mascotas.length > 0 ? (
          mascotas.map((mascota) => (
            <div
              key={mascota.idMascota}
              className="col-md-6 mb-4 d-flex justify-content-center"
            >
              <div
                className={`card tipoAnimal text-center ${
                  selectedMascota?.idMascota === mascota.idMascota
                    ? "selected"
                    : ""
                }`}
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
                onClick={() => handleMascotaSelect(mascota)}
              >
                <img
                  src={mascota.tipoAnimal === "GATO" ? gatoImg : perroImg}
                  className="card-img-top"
                  alt={mascota.tipoAnimal.toLowerCase()}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    {mascota.nombre
                      ? mascota.nombre.toUpperCase()
                      : "SIN NOMBRE"}
                  </h5>
                  <p className="card-text">
                    {mascota.descripcion
                      ? mascota.descripcion
                      : "Sin descripción"}
                  </p>
                  <button
                    type="button"
                    className="btn btn-info btn-sm mt-2"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMascotaEdit({ ...mascota });
                      setSelectedMascota(mascota);
                      cargarDetalleAnimal();
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert text-center">
            <p className="mb-3">
              No hay mascotas registradas. Por favor, registre una.
            </p>
            <button
              type="button"
              className="btn btn-primary confir"
              onClick={() => navigate("/registrar/animal")}
            >
              Ir
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisMascotas;
