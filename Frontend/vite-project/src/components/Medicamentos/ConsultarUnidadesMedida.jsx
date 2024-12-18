import React, { useState, useEffect } from 'react';
import medicamentosService from '../../services/medicamentos.service';
import Modal from '../Visual_Modificador';

const ConsultarUnidadesMedida = () => {
  const [unidadesMedida, setUnidadesMedida] = useState([]);
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
    const fetchUnidadesMedida = async () => {
      try {
        const data = await medicamentosService.obtenerUnidadesMedida();
        if (data.success) {
          setUnidadesMedida(data.result);
        } else {
          setError('No se pudo cargar la lista de unidades de medida.');
        }
      } catch (err) {
        setError('Error al cargar las unidades de medida. Por favor, intenta de nuevo.');
      }
    };
    fetchUnidadesMedida();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title">LISTA DE UNIDADES DE MEDIDA</h2>
      {error && <p className="text-danger">{error}</p>}
      {unidadesMedida.length === 0 && !error ? (
        <p>No hay unidades de medida registradas.</p>
      ) : (
        <div>
          <div className="d-flex justify-content-between mb-3">
            <a href='/registrar/unidad-medida'>
              <button className="btn btn-primary confir2">Crear Unidad de Medida</button>
            </a>
          </div>
          <table className="">
            <thead className="table-primary">
              <tr>
                <th>Id</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {unidadesMedida.map((unidad) => (
                <tr key={unidad.idUnidadMedida}>
                  <td>{unidad.idUnidad}</td>
                  <td>{unidad.tipoUnidad}</td>
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
          // Aquí manejarías la actualización de la unidad de medida
          console.log(formData);
          closeModal();
        }}
      />
    </div>
  );
};

export default ConsultarUnidadesMedida;
