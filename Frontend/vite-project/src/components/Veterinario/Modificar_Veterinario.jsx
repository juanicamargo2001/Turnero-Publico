import React, { useState, useEffect, useContext } from 'react';
import Modal from '../Visual_Modificador';
import {veterinarioService} from '../../services/veterinario.service';
import UserRoleContext from '../Login/UserRoleContext';


const Veterinarios = () => {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [leg, setLegajo] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userRole } = useContext(UserRoleContext);

    const openModal = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const fetchVeterinarios = async () => {
        try {
          const data = await veterinarioService.BuscarTodos();
          setData(data.result);
        } catch (error) {
          setError(error);
        }
    };

    useEffect(() => {
        fetchVeterinarios();
    }, []);
    
    const handleView = (row) => {
        setLegajo(row.idLegajo);
        //MANEJAR ESTO EN UN COMPONENTE ESPECIFICO
        row.fNacimiento = new Date(row.fNacimiento);
        const { idLegajo, ...newRow } = row;
        openModal(newRow);
    };

    const handleModalSubmitSort = async (formData) => {
        /*ACA ORDENO EL JSON PERO NO HACE FALTA
        const orderedKeys = ['matricula', 'nombre', 'apellido', 'telefono', 'habilitado',
            'fecha', 'domicilio', 'dni', 'email' ];
        const jsonReordenado = {idLegajo: leg};
        orderedKeys.forEach(key => {jsonReordenado[key] = formData[key];});*/

        let c = 0;
        Object.keys(formData).forEach((elemento) => {
            if (formData[elemento] === "" || formData[elemento] === undefined || formData[elemento] === null) {
                c = c+1;
            }
        });
        if (c===0){
            formData.idLegajo = leg;
            formData.fNacimiento = formData.fNacimiento.toISOString().split("T")[0] + "T00:00:00";
            try {
                await veterinarioService.Modificar(formData);
                alert("Veterinario modificado correctamente");
                fetchVeterinarios();
            } catch (error) {
                console.error("Error al modificar el veterinario:", error.response ? error.response.data : error);
            }
        } else {
            alert("Ningun atributo puede estar vacío");
        }

        
    };

    const manejarBusqueda = async (e) => {
        if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter')) {
            if (busqueda==="") {
                fetchVeterinarios();
            } else {
                try {
                    const data = await veterinarioService.BuscarPorDni(busqueda);
                    //console.log(data.result);
                    setData(data.result);
                } catch (error) {
                    alert("No se encontraron veterinarios con ese DNI")
                    setError(error);
                    console.error("Error al buscar veterinarios:", error);
                }
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="maven-pro-title">VETERINARIOS</h2>
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-3"
                style={{ gap: '10px' }}
            >
                {/* Mostrar el botón solo si el rol del usuario no es "Secretaria" */}
                {userRole.rol !== 'secretaria' && (
                <a href='/registrar/veterinario' className="mb-2 mb-md-0">
                    <button className="btn btn-primary confir2 w-100 w-md-auto">Crear Veterinario</button>
                </a>
                )}
                <div className="input-group w-100 w-md-25">
                    <input 
                        type="number" 
                        className="form-control" 
                        placeholder="Ingrese DNI del veterinario" 
                        aria-label="Buscar veterinario"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        onKeyDown={manejarBusqueda} 
                    />
                    <span className="input-group-text" onClick={manejarBusqueda} style={{ cursor: 'pointer' }}>
                        <i className="fa fa-search"></i>
                    </span>
                </div>
            </div>
            <table className='responsive-table'>
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
                        <td>{row.idLegajo}</td>
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
                        <a href='#' onClick={() => handleView(row)}><i title="Modificar" className="fa fa-edit" aria-hidden="true"></i></a>
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
    );
};

export default Veterinarios;