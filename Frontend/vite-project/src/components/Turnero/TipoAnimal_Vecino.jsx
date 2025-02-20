import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import gatoImg from "../../imgs/gato.png";
import perroImg from "../../imgs/perro.png";
import mascotaService from "../../services/animal/mascota.service";
import Swal from "sweetalert2";

const TipoAnimal_Vecino = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let title;
  let turneroPath;

  switch (location.pathname) {
    case "/tipoAnimal/alberdi":
      title = "Turnero CDC Alberdi";
      turneroPath = "/registrar/turno/alberdi";
      break;
    case "/tipoAnimal/lafrance":
      title = "Turnero CDC La France";
      turneroPath = "/registrar/turno/lafrance";
      break;
    case "/tipoAnimal/villallende":
      title = "Turnero CDC Villa Allende";
      turneroPath = "/registrar/turno/villaallende";
      break;
    default:
      title = "Selecciona un CDC";
  }

  useEffect(() => {
    const fetchMascotas = async () => {
      try {
        const response = await mascotaService.obtenerMisMascotas();
        if (response.success && response.result) {
          setMascotas(response.result);
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchMascotas();
  }, []);

  const handleMascotaSelect = (mascota) => {
    setSelectedMascota(mascota);
  };

  const handleConfirm = () => {
    if (!selectedMascota) {
      Swal.fire({
        text: "Por favor, selecciona una mascota.",
        icon: "info",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => {});
      return;
    }

    // Navega a la ruta correspondiente pasando el tipo de animal y el ID de la mascota en el estado
    navigate(turneroPath, {
      state: {
        tipoAnimal: selectedMascota.tipoAnimal,
        idMascota: selectedMascota.idMascota,
      },
    });
  };

  const handleShowDetails = (mascota) => {
    Swal.fire({
      title: "Detalles de la Mascota",
      html: `<div style="font-size: 16px; line-height: 1.8;">
             <strong>Nombre:</strong> ${
               mascota.nombre
                 ? mascota.nombre.charAt(0).toUpperCase() +
                   mascota.nombre.slice(1).toLowerCase()
                 : ""
             }<br>
             <strong>Edad:</strong> ${mascota.edad ?? ""}<br>
             <strong>Sexo:</strong> ${
               mascota.sexo
                 ? mascota.sexo.charAt(0).toUpperCase() +
                   mascota.sexo.slice(1).toLowerCase()
                 : ""
             }<br>
             <strong>Tamaño:</strong> ${
               mascota.tamaño
                 ? mascota.tamaño.charAt(0).toUpperCase() +
                   mascota.tamaño.slice(1).toLowerCase()
                 : ""
             }
           </div>`,
      confirmButtonColor: "#E15562",
      confirmButtonText: "OK",
    });
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">Cargando mascotas...</div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5">
        Error al cargar las mascotas
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4 maven-pro-title">{title}</h1>
      <div className="row">
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

                  <button
                    className="btn btn-info btn-sm mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowDetails(mascota);
                    }}
                  >
                    Detalles
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
      <div className="d-flex justify-content-end p-2">
        <button
          type="button"
          className="btn btn-dark me-2 confir2"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
        <button
          type="button"
          className="btn btn-primary confir"
          onClick={handleConfirm}
          disabled={!selectedMascota}
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default TipoAnimal_Vecino;
