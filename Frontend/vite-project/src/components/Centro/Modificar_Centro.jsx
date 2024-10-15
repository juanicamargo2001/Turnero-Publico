import React, { useState, useEffect } from 'react';
import Modal from '../Visual_Modificador';
import { centroService } from '../../services/centro.service';

export default function Modificar_Centro() {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [idCentro, setIdCentro] = useState(null);

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

    const fecthCentros = async () => {
        try {
          const data = await centroService.BuscarTodos();
          setData(data.result);
        } catch (error) {
          setError(error);
        }
    };

    const handleView = (row) => {
        setIdCentro(row.id_centro_castracion);
        const { idCentro, ...newRow } = row;
        openModal(newRow);
    };

    const handleModalSubmitSort = async (formData) => {
        if (!formData.nombre || !formData.barrio || !formData.calle) {
            alert("Los campos nombre, barrio y calle son obligatorios.");
            return; // Salir de la función si hay campos vacíos
        }
        formData.id_centro_castracion = idCentro;
        if (formData.altura === null || formData.altura === "") {
            formData.altura = "0";
        }
        try {
            await centroService.Modificar(formData);
            alert("Centro modificado correctamente");
            fetchCentros();
        } catch (error) {
            console.error("Error al modificar el centro:", error.response ? error.response.data : error);
        }
    };

    useEffect(() => {
        fecthCentros();
    }, []);

  return (
    <div className="container mt-4">
            <h2 className="maven-pro-title">CENTROS DE CASTRACION</h2>
            <div className="d-flex justify-content-between mb-3">
                <a href='/registrar/centro'>
                    <button className="btn btn-primary confir">Crear centro de castracion</button>
                </a>
            </div>
            <table>
                <thead>
                    <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Barrio</th>
                    <th>Calle</th>
                    <th>Altura</th>
                    <th>Habilitado</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.id_centro_castracion}</td>
                        <td>{row.nombre}</td>
                        <td>{row.barrio}</td>
                        <td>{row.calle}</td>
                        <td>
                            {row.altura ? (
                            <span>{row.altura}</span>
                        ) : (
                            <span>Sin altura</span>
                            )}
                        </td>
                        <td>
                            {row.habilitado ? 
                                <span style={{ color: 'green' }}>✓</span> : 
                                <span style={{ color: 'red' }}>✗</span>
                            }
                        </td>
                        <td className="iconos">
                        <a href='#' onClick={() => handleView(row)}><i title="Información" className="fa fa-edit" aria-hidden="true"></i></a>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                show={isModalOpen}
                handleClose={closeModal}
                item={selectedItem || {}}
                onSubmitSort={handleModalSubmitSort}
            />
        </div>
  )
}
