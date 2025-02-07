import "bootstrap/dist/css/bootstrap.min.css";
import footerImg from "../imgs/footer.png"; // Ruta de la imagen
import "./footer.css";

const Footer = () => {
  return (
    <footer className="bg-light pb-0">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-md-4 p-4">
            <h6 className="mb-3">Seguinos en nuestras redes</h6>
            <div className="d-flex justify-content-center gap-3">
              <a
                href="https://www.facebook.com/bienestaranimalcba.ok"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none social-icon"
              >
                <i className="fab fa-facebook fs-3"></i>
              </a>
              <a
                href="https://www.instagram.com/bienestaranimal.ok/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none social-icon"
              >
                <i className="fab fa-instagram fs-3"></i>
              </a>
            </div>
          </div>
          <div className="col-md-4 p-4">
            <h6 className="mb-3">
              Podés solicitar un turno comunicándote al:
            </h6>
            <div className="d-flex flex-column align-items-center">
              <p className="mb-2">
                <i className="fas fa-phone-alt me-2"></i> 0800-888-0404 vía llamada telefónica
              </p>
              <p>
                <i className="fab fa-whatsapp me-2"></i> 351-610-0444 vía WhatsApp
              </p>
            </div>
          </div>
        </div>
        <div className="footer-image-container mt-0">
          <img src={footerImg} alt="Logos del footer" className="footer-image" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;