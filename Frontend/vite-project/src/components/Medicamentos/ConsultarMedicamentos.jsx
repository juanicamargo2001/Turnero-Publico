import React, { useState, useEffect } from 'react';
import medicamentosService from '../../services/medicamento/medicamentos.service';
import Modal from '../Visual_Modificador';

const ConsultarMedicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchMedicamentos = async () => {
      try {
        const data = await medicamentosService.obtenerMedicamentos();
        if (data.success) {
          setMedicamentos(data.result);
        } else {
          setError('No se pudo cargar la lista de medicamentos.');
        }
      } catch (err) {
        setError('Error al cargar los medicamentos. Por favor, intenta de nuevo.');
      }
    };
    fetchMedicamentos();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">LISTA DE MEDICAMENTOS</h2>
      {error && <p className="text-danger">{error}</p>}
      {medicamentos.length === 0 && !error ? (
        <p>No hay medicamentos registrados.</p>
      ) : (
        <div>
          <div className="d-flex justify-content-between mb-3">
            <a href='/registrar/medicamento'>
              <button className="btn btn-primary confir">Crear</button>
            </a>
          </div>
          <table className="">
            <thead className="table-primary">
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody className="text-uppercase">
              {medicamentos.map((medicamento) => (
                <tr key={medicamento.idMedicacion}>
                  <td>{medicamento.nombre}</td>
                  <td>{medicamento.descripcion}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        show={isModalOpen}
        handleClose={closeModal}
        item={selectedItem || {}}
        onSubmitSort={(formData) => {
          // Aquí manejarías la actualización del medicamento
          console.log(formData);
          closeModal();
        }}
      />
    </div>
  );
};

export default ConsultarMedicamentos;
