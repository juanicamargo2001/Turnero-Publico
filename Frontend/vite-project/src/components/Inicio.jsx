import React from 'react';

const Inicio = () => {
  return (
    <div>

      {/* Contenido principal */}
      <div className="container mt-4">
        <div className="text-center">
          <h1 className="maven-pro-title">Fauna Doméstica</h1>
        </div>

        <div className="mt-4">
          <p className="maven-pro-body">
            El cuidado de la fauna doméstica es responsabilidad de todos. Como Ente Municipal, tenemos la iniciativa de controlar la reproducción de mascotas, acercando y facilitando a los vecinos la castración segura y gratuita de perros y gatos.
          </p>
          <p className="maven-pro-body">
            La <strong>castración quirúrgica</strong> es el mejor método para controlar la reproducción de animales domésticos y en situación de calle porque es ético, eficaz, seguro, económico, definitivo y beneficioso para la salud de los animales y las personas.
          </p>
          <p className="maven-pro-body">
            Entre las principales ventajas se encuentra la disminución del abandono, la crueldad animal y la proliferación de enfermedades zoonóticas que se transmiten de animales a humanos.
          </p>
        </div>

        <div className="mt-5">
          <h2 className="maven-pro-title">Nuestro Programa</h2>
          <p className="maven-pro-body">
            Contamos con el <strong>Programa de Control Poblacional y Castración Social</strong>, que dispone de diversas jornadas de castración en distintos puntos de la ciudad a través de móviles. Además, contamos con un <strong>Centro de Control de Reproducción y Tenencia Responsable de Mascotas</strong>.
          </p>
          <p className="maven-pro-body">
            Este centro cuenta con instalaciones modernas, incluyendo una sala prequirúrgica, un quirófano con tres mesas de cirugía, sala de recuperación, sala de espera, depósito para insumos, zona de residuos patógenos, sala de reuniones, oficinas y otras dependencias.
          </p>
        </div>

        <div className="mt-5">
          <h2 className="maven-pro-title">Beneficios de la Castración</h2>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Reduce el abandono y la crueldad animal.</li>
            <li className="list-group-item">Disminuye la proliferación de enfermedades zoonóticas.</li>
            <li className="list-group-item">Mejora la convivencia entre animales y personas.</li>
            <li className="list-group-item">Contribuye al control poblacional ético y seguro.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
