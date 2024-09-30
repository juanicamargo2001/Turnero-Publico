import React, { useState, useEffect } from 'react';
import Modal from '../Visual_Modificador';


const Veterinarios = () => {
    //const [data, setData] = useState([]);

    //EJEMPLO DE FILA DE DATOS
    const data = [
        { legajo: '001', nombre: 'Juan', apellido: 'Pérez', email:'juanperes@gmail.com', dni:42642421 , habilitado:true, telefono:35131313131, matricula:400 },
        { legajo: '002', nombre: 'María', apellido: 'López', email:'juanperes@gmail.com', dni:42642421 , habilitado:true, telefono:35131313131, matricula:400 },
        { legajo: '003', nombre: 'Carlos', apellido: 'González', email:'juanperes@gmail.com', dni:42642421 , habilitado:false, telefono:35131313131, matricula:400 }
    ];

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
        /*fetch('https://api.ejemplo.com/data') // Cambia esta URL por tu query real
        .then(response => response.json())
        .then(result => setData(result))
        .catch(error => console.error('Error fetching data:', error));*/
    }, []);
    
    const handleView = (row) => {
        openModal(row);
    };

    return (
        <div className="container mt-4">
            <h2 className="maven-pro-title">VETERINARIOS</h2>
            <div className="d-flex justify-content-between mb-3">
                <a href='/registrar/veterinario'>
                    <button className="btn btn-primary confir">Crear Veterinario</button>
                </a>
                <div className="input-group w-25">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Buscar veterinario..." 
                    aria-label="Buscar veterinario" 
                />
                <span className="input-group-text">
                    <i className="fa fa-search"></i>
                </span>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                    <th>Legajo</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Habilitado</th>
                    <th>Telefono</th>
                    <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.legajo}</td>
                        <td>{row.nombre}</td>
                        <td>{row.apellido}</td>
                        <td>{row.dni}</td>
                        <td>{row.email}</td>
                        <td>
                            {row.habilitado ? 
                                <span style={{ color: 'green' }}>✓</span> : 
                                <span style={{ color: 'red' }}>✗</span>
                            }
                        </td>
                        <td>{row.telefono}</td>
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
            />
        </div>
    );
};

export default Veterinarios;