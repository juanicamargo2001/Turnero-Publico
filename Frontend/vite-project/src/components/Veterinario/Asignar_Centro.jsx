import React, { useEffect, useState } from 'react';
import {veterinarioService} from "../../services/veterinario.service";
import {centroService} from "../../services/centro.service"
import { veterinarioCentroService } from '../../services/veterinarioXcentro';

const RegistroVeterinarioXCentro = () => {
    const [data, setData] = useState([]);
    const [options, setOptions] = useState([]);

    const fetchVeterinarios = async () => {
        try {
          const data = await veterinarioService.BuscarTodos();
          setData(data.result);
        } catch (error) {
          setError(error);
        }
    };

    const fetchCentros = async () => {
        try {
          //Se muestran solo los centros HABILITADOS
          const data = await centroService.BuscarTodos();
          const habilitados = data.result.filter(c => c.habilitado);
          setOptions(habilitados);
        } catch (error) {
          setError(error);
        }
    };

    useEffect(() => {
        fetchVeterinarios();
        fetchCentros();
    }, []);

    const handleSubmit = async (legajo) => {
        const selectedValue = document.getElementById(legajo).value;
        if (selectedValue==="") {alert("Seleccione un centro")}
        else {
            try {
                const data = await veterinarioCentroService.AsignarCentro(legajo, selectedValue);
                alert('Guardado exitosamente');
            } catch (error) {
                console.error('Error al guardar los datos:', error);
                alert('Error al guardar los datos');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="maven-pro-title">ASIGNAR CENTRO DE CASTRACION A VETERINARIO</h2>
            <table>
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
                            <select id={row.idLegajo} class="form-select w-50 me-3">
                                <option value="">-- Selecciona una opción --</option>
                                {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.nombre}
                                </option>
                                ))}
                            </select>
                            <button type="submit" class="btn btn-success" onClick={() => handleSubmit(row.idLegajo)}>Guardar</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RegistroVeterinarioXCentro;