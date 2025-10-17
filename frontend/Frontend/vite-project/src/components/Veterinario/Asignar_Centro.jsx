import { useEffect, useState } from 'react';
import {veterinarioService} from "../../services/veterinario/veterinario.service";
import {centroService} from "../../services/centro/centro.service"
import { veterinarioCentroService } from '../../services/veterinario/veterinarioXcentro';
import Swal from 'sweetalert2';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button } from "@mui/material";
import { styled } from "@mui/material/styles";

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

    const StyledTableContainer = styled(TableContainer)({
        margin: "0 auto",
        borderRadius: 8,
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        padding: 0,
      });
      
      const StyledTable = styled(Table)({
        minWidth: 700,
        borderCollapse: "separate",
        borderSpacing: 0,
      });
      
      const StyledTableHead = styled(TableHead)(({ theme }) => ({
        backgroundColor: theme.palette.info.main,
      }));
      
      const StyledTableCell = styled(TableCell)(({ theme }) => ({
        color: theme.palette.common.white,
        fontWeight: "bold",
        fontSize: "16px",
        padding: "12px 16px",
      }));
      
      const StyledTableBodyCell = styled(TableCell)({
        fontSize: "0.96rem",
        padding: "10px 16px",
      });
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        "&:nth-of-type(odd)": {
          backgroundColor: theme.palette.action.hover,
        },
        "&:last-child td, &:last-child th": {
          border: 0,
        },
      }));

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
            <h2 className="maven-pro-title text-center mb-4">ASIGNAR CENTRO DE CASTRACIÓN A VETERINARIO</h2>
            {/* <table className='responsive-table'>
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
            </table> */}
            <StyledTableContainer component={Paper}>
      <StyledTable>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>Legajo</StyledTableCell>
            <StyledTableCell>Nombre</StyledTableCell>
            <StyledTableCell>Apellido</StyledTableCell>
            <StyledTableCell>DNI</StyledTableCell>
            <StyledTableCell>Habilitado</StyledTableCell>
            <StyledTableCell>Asignar Centro de Castración</StyledTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableBodyCell>{row.idLegajo}</StyledTableBodyCell>
              <StyledTableBodyCell>{row.nombre}</StyledTableBodyCell>
              <StyledTableBodyCell>{row.apellido}</StyledTableBodyCell>
              <StyledTableBodyCell>{row.dni}</StyledTableBodyCell>
              <StyledTableBodyCell className='text-center'>
                {row.habilitado ? (
                  <span style={{ color: "green", fontWeight: "bold" }}>✓</span>
                ) : (
                  <span style={{ color: "red", fontWeight: "bold" }}>✗</span>
                )}
              </StyledTableBodyCell>
              <StyledTableBodyCell className='seleCentroDiv d-flex justify-content-center align-items-center gap-3'>
              <select id={row.idLegajo} className="form-select w-50 me-3">
                                <option value="">-- Selecciona una opción --</option>
                                {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.nombre}
                                </option>
                                ))}
                            </select>
                <Button
                  variant="contained"
                  color="info"
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleSubmit(row.idLegajo)}
                >
                  Guardar
                </Button>
              </StyledTableBodyCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
        </div>
    );
};

export default RegistroVeterinarioXCentro;