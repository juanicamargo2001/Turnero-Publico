import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { calificacionService } from "../services/vecino/calificacion.service";


const Calificacion = () => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("c");
    
    e.preventDefault();
    const dataToSend = {
      numeroCalificacion: puntuacion,
      descripcion: descripcion,
      token: token
    };
    
    let response = await calificacionService.Grabar(dataToSend);

    if (response){
      setIsSubmitted(true);
    }
  };

  return (
    <div className="container mt-4 maven-pro-body page-container" style={{ maxWidth: "600px" }}>
      {!isSubmitted ? (
        <div>
          <h3 className="maven-pro-title mt-2 mb-2 text-center">¿Cómo fue la experiencia de tu mascota con nosotros?</h3>
          <form onSubmit={handleSubmit}>
            <div className="m-5 d-flex justify-content-center">
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="me-2"
                    style={{
                      cursor: "pointer",
                      fontSize: "3rem",
                      fontWeight: "bold",
                      color: star <= puntuacion ? "#E26F00" : "#B0B0B0"
                    }}
                    onClick={() => {
                      setPuntuacion(star);
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">¡Tu opinión nos ayuda a mejorar!</label>
              <textarea
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary" style={{ width: "250px", borderRadius: "20px" }}>
                Enviar
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center maven-pro-title" style={{ minHeight: "300px" }}>
          <div className="text-center">
            <h3>¡Gracias por tu calificación!</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calificacion;
