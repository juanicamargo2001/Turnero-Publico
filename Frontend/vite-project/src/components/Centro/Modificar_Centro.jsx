import { useState, useEffect, useContext } from 'react';
import Modal from '../Visual_Modificador';
import { centroService } from '../../services/centro/centro.service';
import Informacion_VxC from './Informacion_VxC.jsx';
import UserRoleContext from '../Login/UserRoleContext';
import Swal from 'sweetalert2';
import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";

export default function Modificar_Centro() {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [idCentro, setIdCentro] = useState(null);

    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [nombreCentro, setNombreCentro] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]); 
    const [showVeterinarios, setShowVeterinarios] = useState(false); 
    const { userRole } = useContext(UserRoleContext);

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
            Swal.fire({
                text: "Hay campos sin completar.",
                icon: "info",
                confirmButtonColor: "#E15562",
                confirmButtonText: "OK",
              }).then(() => {
            });
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
            Swal.fire({
                title: "¡Éxito!",
                text: "Centro modificado correctamente",
                icon: "success",
                confirmButtonColor: "#E15562",
                confirmButtonText: "OK",
              }).then(() => {
            });
            fecthCentros();
        } catch (error) {
            console.error("Error al modificar el centro:", error.response ? error.response.data : error);
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
        padding: "7px 16px",
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
        fecthCentros();
    }, []);

  return (
    <div className="container mt-4 page-container">
            <h2 className="maven-pro-title text-center mb-4">CENTROS DE CASTRACIÓN</h2>
           {/* Mostrar el botón solo si el rol del usuario no es "Secretaria" */}
           {userRole.rol !== 'secretaria' && (
                <div className="d-flex justify-content-between mb-3">
                    <a href='/registrar/centro'>
                        <button className="btn btn-primary confir3">Crear centro de castración</button>
                    </a>
                </div>
            )}
            {/* <table className='responsive-table'>
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
            </table> */}
            <StyledTableContainer component={Paper}>
                <StyledTable>
                    <StyledTableHead>
                    <TableRow>
                        <StyledTableCell>Id</StyledTableCell>
                        <StyledTableCell>Nombre</StyledTableCell>
                        <StyledTableCell>Barrio</StyledTableCell>
                        <StyledTableCell>Calle</StyledTableCell>
                        <StyledTableCell>Altura</StyledTableCell>
                        <StyledTableCell>Habilitado</StyledTableCell>
                        <StyledTableCell>Horario Laboral</StyledTableCell>
                        <StyledTableCell>Acciones</StyledTableCell>
                    </TableRow>
                    </StyledTableHead>
                    <TableBody>
                    {data.map((row, index) => (
                        <StyledTableRow key={index}>
                        <StyledTableBodyCell>{row.id_centro_castracion}</StyledTableBodyCell>
                        <StyledTableBodyCell>{row.nombre}</StyledTableBodyCell>
                        <StyledTableBodyCell>{row.barrio}</StyledTableBodyCell>
                        <StyledTableBodyCell>{row.calle}</StyledTableBodyCell>
                        <StyledTableBodyCell>
                            {row.altura ? row.altura : "Sin altura"}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                            {row.habilitado ? (
                            <span style={{ color: "green", fontWeight: "bold" }}>✓</span>
                            ) : (
                            <span style={{ color: "red", fontWeight: "bold" }}>✗</span>
                            )}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                        {row.horaLaboralInicio ? row.horaLaboralInicio.split(':')[0] : 'N/A'} HS- 
                        {row.horaLaboralFin ? row.horaLaboralFin.split(':')[0] : 'N/A'} HS
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                            <a href='#' onClick={() => handleView(row)} className='btn btn-separator'><i title="Modificar" className="fa fa-edit" aria-hidden="true"></i></a>
                            <a onClick={() => handleInfo(row)}><i className="fa fa-info-circle" style={{fontSize: "1rem"}} title="Informacion" aria-hidden="true"></i></a>
                        </StyledTableBodyCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>

            <Modal
                show={isModalOpen}
                handleClose={closeModal}
                item={selectedItem || {}}
                onSubmitSort={handleModalSubmitSort}
            />

            {showVeterinarios && 
            <div className='w-100'>
                <Informacion_VxC 
                veterinarios={veterinarios} 
                nombreCentro={nombreCentro}
                />
                <button className="btn btn-primary confir mt-3" onClick={handleCloseInfo}>Cerrar</button>
            </div>
            }
        </div>
  )
}
