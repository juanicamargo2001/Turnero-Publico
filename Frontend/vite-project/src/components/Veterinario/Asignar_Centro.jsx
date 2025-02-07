import { useEffect, useState } from 'react';
import {veterinarioService} from "../../services/veterinario/veterinario.service";
import {centroService} from "../../services/centro/centro.service"
import { veterinarioCentroService } from '../../services/veterinario/veterinarioXcentro';
import Swal from 'sweetalert2';

const RegistroVeterinarioXCentro = () => {
    const [data, setData] = useState([]);
    const [options, setOptions] = useState([]);

    const fetchVeterinarios = async () => {
        try {
          const data = await veterinarioService.BuscarTodos();
          const habilitados = data.result.filter(c => c.habilitado);
          setData(habilitados);
        } catch (error) {
            console.error(error)
        }
    };

    const fetchCentros = async () => {
        try {
          //Se muestran solo los centros HABILITADOS
          const data = await centroService.BuscarTodos();
          const habilitados = data.result.filter(c => c.habilitado);
          setOptions(habilitados);
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        fetchVeterinarios();
        fetchCentros();
    }, []);

    const handleSubmit = async (legajo) => {
        const selectedValue = document.getElementById(legajo).value;
        if (selectedValue==="") {Swal.fire({
            text: "Seleccione un centro",
            icon: "info",
            confirmButtonColor: "#E15562",
            confirmButtonText: "OK",
          }).then(() => {
        });}
        else {
            try {
                await veterinarioCentroService.AsignarCentro(legajo, selectedValue);
                Swal.fire({
                              title: "¡Éxito!",
                              text: "Guardado correctamente",
                              icon: "success",
                              confirmButtonColor: "#E15562",
                              confirmButtonText: "OK",
                            }).then(() => {
                          });
            } catch (error) {
                console.error('Error al guardar los datos:', error);
                Swal.fire({
                    text: "Error al guardar los datos",
                    icon: "error",
                    confirmButtonColor: "#E15562",
                    confirmButtonText: "OK",
                  }).then(() => {
                });
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="maven-pro-title">ASIGNAR CENTRO DE CASTRACIÓN A VETERINARIO</h2>
            <table className='responsive-table'>
                <thead>
                    <tr>
                    <th>Legajo</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>DNI</th>
                    <th>Habilitado</th>
                    <th>Asignar Centro de Castracion</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                    <tr key={index}>
                        <td>{row.idLegajo}</td>
                        <td>{row.nombre}</td>
                        <td>{row.apellido}</td>
                        <td>{row.dni}</td>
                        <td>
                            {row.habilitado ? 
                                <span style={{ color: 'green' }}>✓</span> : 
                                <span style={{ color: 'red' }}>✗</span>
                            }
                        </td>
                        <td className="seleCentroDiv d-flex justify-content-center align-items-center gap-3">
                            <select id={row.idLegajo} className="form-select w-50 me-3">
                                <option value="">-- Selecciona una opción --</option>
                                {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.nombre}
                                </option>
                                ))}
                            </select>
                            <button type="submit" className="btn btn-primary confir" onClick={() => handleSubmit(row.idLegajo)}>Guardar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RegistroVeterinarioXCentro;