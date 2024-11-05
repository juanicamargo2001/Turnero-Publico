import React, { useState, useEffect } from 'react';
import Modal from '../Visual_Modificador';
import { centroService } from '../../services/centro.service';
import Informacion_VxC from './Informacion_VxC.JSX';

export default function Modificar_Centro() {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [idCentro, setIdCentro] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [nombreCentro, setNombreCentro] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]); 
    const [showVeterinarios, setShowVeterinarios] = useState(false); 

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

    const handleInfo = async (row) =>{
        const centroId = row.id_centro_castracion
        const centroName = row.nombre
        try{
            const data = await centroService.BuscarVetxCentro(centroId);
            setVeterinarios(data.result.veterinarios);
            setNombreCentro(centroName)
            setShowVeterinarios(true);
            //console.log(veterinarios)
        }catch (error){
            setError(error)
        }
        
      }
    
    const handleCloseInfo = () =>{
        setShowVeterinarios(false);
        setVeterinarios([]);
    }

    const handleView = (row) => {
        setIdCentro(row.id_centro_castracion);
        const { idCentro, ...newRow } = row;
        openModal(newRow);
    };

    const handleModalSubmitSort = async (formData) => {
        if (!formData.nombre || !formData.barrio || !formData.calle || !formData.horaLaboralInicio || !formData.horaLaboralFin) {
            alert("Hay campos sin completar.");
            return; 
        }
    
        if (formData.altura === null || formData.altura === "") {
            formData.altura = "0";
        }
        
        const horaRegex = /^(0[7-9]|1[0-8]|19):([0-5]\d):([0-5]\d)$/;

        if (!horaRegex.test(formData.horaLaboralInicio)) {
            alert("El formato debe ser 'hh:mm:ss' que se encuentre entre las 07HS y las 19HS");
            return;
        }

        if (!horaRegex.test(formData.horaLaboralFin)) {
            alert("El formato debe ser 'hh:mm:ss' que se encuentre entre las 07HS y las 19HS");
            return;
        }

        const [inicioHoras] = formData.horaLaboralInicio.split(':');
        const [finHoras] = formData.horaLaboralFin.split(':');

        if (parseInt(finHoras) <= parseInt(inicioHoras)) {
            alert("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }

        formData.id_centro_castracion = idCentro;
        
        //console.log(formData)
        
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
            <h2 className="maven-pro-title">CENTROS DE CASTRACIÓN</h2>
            <div className="d-flex justify-content-between mb-3">
                <a href='/registrar/centro'>
                    <button className="btn btn-primary confir2">Crear centro de castración</button>
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
                    <th>Horario Laboral</th>
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
                        <td>{row.horaLaboralInicio ? row.horaLaboralInicio.split(':')[0] : 'N/A'} HS- 
                        {row.horaLaboralFin ? row.horaLaboralFin.split(':')[0] : 'N/A'} HS</td>
                        <td className="iconos">
                        <a href='#' onClick={() => handleView(row)} className='btn btn-separator'><i title="Modificar" className="fa fa-edit" aria-hidden="true"></i></a>
                        <a onClick={() => handleInfo(row)}><i className="fa fa-info-circle" title="Informacion" aria-hidden="true"></i></a>
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

            {showVeterinarios && 
            <div>
                <Informacion_VxC 
                veterinarios={veterinarios} 
                nombreCentro={nombreCentro}
                />
                <button className="btn btn-secondary mt-3" onClick={handleCloseInfo}>Cerrar</button>
            </div>
            }
        </div>
  )
}
