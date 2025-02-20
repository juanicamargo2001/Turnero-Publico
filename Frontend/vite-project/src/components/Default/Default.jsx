const Default = () => {
  return (
    <div className="page-container">
      <div className="container mt-4">
        <h2 className="maven-pro-title text-center">Página No Encontrada</h2>
        <div className="text-center mt-5">
          <p className="maven-pro-body">
            Lo sentimos, la página que está buscando no existe o ha sido movida.
          </p>
          
          <a href="/" className="btn btn-primary ms-auto confir">
            Ir al Inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default Default;
