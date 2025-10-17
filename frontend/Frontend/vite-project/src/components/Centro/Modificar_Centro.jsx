import React, { useState, useEffect, useContext } from 'react';
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
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    FormHelperText,
    Box,
  } from "@mui/material";

export default function Modificar_Centro() {
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    const [idCentro, setIdCentro] = useState(null);
      const [erros, setErros] = useState({});

      const [selectedItem, setSelectedItem] = useState({
        nombre: "",
        barrio: "",
        calle: "",
        altura: "",
        horaLaboralInicio: "",
        horaLaboralFin: "",
        habilitado: ""
      });
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

    const handleSubmit = async (event) => {
          event.preventDefault();
      
          let validationErrors = {};

          if (!selectedItem.nombre || selectedItem.nombre.trim() === "")
            validationErrors.nombre = "El nombre es requerido";
        
          if (!selectedItem.barrio || selectedItem.barrio.trim() === "")
            validationErrors.barrio = "El barrio es requerido";
        
          if (!selectedItem.calle || selectedItem.calle.trim() === "")
            validationErrors.calle = "La calle es requerida";
        
          if (
            selectedItem.altura === undefined ||
            selectedItem.altura === null ||
            selectedItem.altura.toString().trim() === ""
          ) {
            validationErrors.altura = "La altura es requerida";
          } else if (isNaN(selectedItem.altura) || selectedItem.altura <= 0) {
            validationErrors.altura = "La altura debe ser un número válido y mayor a 0";
          }
        
          if (
            selectedItem.horaLaboralInicio === undefined ||
            selectedItem.horaLaboralInicio === ""
          ) {
            validationErrors.horaLaboralInicio = "La hora de inicio es requerida";
          }
        
          if (
            selectedItem.horaLaboralFin === undefined ||
            selectedItem.horaLaboralFin === ""
          ) {
            validationErrors.horaLaboralFin = "La hora de fin es requerida";
          }
        
          if (
            selectedItem.horaLaboralInicio &&
            selectedItem.horaLaboralFin &&
            selectedItem.horaLaboralInicio >= selectedItem.horaLaboralFin
          ) {
            validationErrors.horaLaboralFin =
              "La hora de fin debe ser posterior a la hora de inicio";
          }
        
          if (Object.keys(validationErrors).length > 0) {
            setErros(validationErrors);
            return;
          }
          

          console.log(selectedItem)
    
          try {
              
              let response = await centroService.Modificar({
                ...selectedItem,
                horaLaboralInicio: selectedItem.horaLaboralInicio?.includes(":")
                  ? (selectedItem.horaLaboralInicio.match(/^\d{2}:\d{2}:\d{2}$/)
                      ? selectedItem.horaLaboralInicio
                      : `${selectedItem.horaLaboralInicio}:00`)
                  : `${selectedItem.horaLaboralInicio}:00:00`,
                  
                horaLaboralFin: selectedItem.horaLaboralFin?.includes(":")
                  ? (selectedItem.horaLaboralFin.match(/^\d{2}:\d{2}:\d{2}$/)
                      ? selectedItem.horaLaboralFin
                      : `${selectedItem.horaLaboralFin}:00`)
                  : `${selectedItem.horaLaboralFin}:00:00`,
              }, idCentro);
              console.log(response)
              if (response != null)
                Swal.fire({
                  text: "El centro se editó correctamente",
                  icon: "success",
                  confirmButtonColor: "#E15562",
                  confirmButtonText: "OK",
                }).then(() => {
                  window.location.reload();
                });
            } catch {
              Swal.fire({
                text: "Sucedió un error al editar",
                icon: "error",
                confirmButtonColor: "#E15562",
                confirmButtonText: "OK",
              })
          }
          closeModal();
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
           {userRole.rol == 'superAdministrador' && (
                <div className="d-flex justify-content-between mb-3">
                    <a href='/registrar/centro'>
                        <button className="btn btn-primary confir3">Crear centro de castración</button>
                    </a>
                </div>
            )}
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
                        <StyledTableBodyCell className='text-center'>
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
                        {userRole.rol == "superAdministrador" && (
                            <a href='#' onClick={() => handleView(row)} className='btn btn-separator'><i title="Modificar" className="fa fa-edit" aria-hidden="true"></i></a>
                        )}
                            <a onClick={() => handleInfo(row)}><i className="fa fa-info-circle" style={{fontSize: "1rem"}} title="Informacion" aria-hidden="true"></i></a>
                        </StyledTableBodyCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </StyledTable>
            </StyledTableContainer>
{/* 
            <Modal
                show={isModalOpen}
                handleClose={closeModal}
                item={selectedItem || {}}
                onSubmitSort={handleModalSubmitSort}
            /> */}

            <React.Fragment>
                        <Dialog open={isModalOpen} onClose={closeModal} fullWidth>
                          <DialogContent>
                          <form onSubmit={handleSubmit}>
                            {/* Nombre */}
                            <Box mb={2}>
                            <TextField
                                label="Nombre"
                                fullWidth
                                variant="standard"
                                value={selectedItem.nombre || ""}
                                onChange={(e) =>
                                setSelectedItem((prev) => ({ ...prev, nombre: e.target.value }))
                                }
                                error={Boolean(erros.nombre)}
                                helperText={erros.nombre}
                            />
                            </Box>

                            {/* Barrio */}
                            <Box mb={2}>
                            <TextField
                                label="Barrio"
                                fullWidth
                                variant="standard"
                                value={selectedItem.barrio || ""}
                                onChange={(e) =>
                                setSelectedItem((prev) => ({ ...prev, barrio: e.target.value }))
                                }
                                error={Boolean(erros.barrio)}
                                helperText={erros.barrio}
                            />
                            </Box>

                            {/* Calle */}
                            <Box mb={2}>
                            <TextField
                                label="Calle"
                                fullWidth
                                variant="standard"
                                value={selectedItem.calle || ""}
                                onChange={(e) =>
                                setSelectedItem((prev) => ({ ...prev, calle: e.target.value }))
                                }
                                error={Boolean(erros.calle)}
                                helperText={erros.calle}
                            />
                            </Box>

                            {/* Altura */}
                            <Box mb={2}>
                            <TextField
                                label="Altura"
                                fullWidth
                                variant="standard"
                                type="number"
                                value={selectedItem.altura || ""}
                                onChange={(e) =>
                                setSelectedItem((prev) => ({ ...prev, altura: e.target.value }))
                                }
                                error={Boolean(erros.altura)}
                                helperText={erros.altura}
                            />
                            </Box>

                            {/* Hora Laboral Inicio */}
                            <Box mb={2}>
                            <TextField
                                label="Hora Laboral Inicio"
                                fullWidth
                                variant="standard"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={selectedItem.horaLaboralInicio || ""}
                                onChange={(e) =>
                                setSelectedItem((prev) => ({
                                    ...prev,
                                    horaLaboralInicio: e.target.value,
                                }))
                                }
                                error={Boolean(erros.horaLaboralInicio)}
                                helperText={erros.horaLaboralInicio}
                            />
                            </Box>

                            {/* Hora Laboral Fin */}
                            <Box mb={2}>
                            <TextField
                                label="Hora Laboral Fin"
                                fullWidth
                                variant="standard"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={selectedItem.horaLaboralFin || ""}
                                onChange={(e) =>
                                setSelectedItem((prev) => ({
                                    ...prev,
                                    horaLaboralFin: e.target.value,
                                }))
                                }
                                error={Boolean(erros.horaLaboralFin)}
                                helperText={erros.horaLaboralFin}
                            />
                            </Box>

                            {/* Habilitado */}
                            <Box mb={2}>
                            <FormControl
                                fullWidth
                                variant="standard"
                                error={Boolean(erros.habilitado)}
                            >
                                <InputLabel>¿Está habilitado?</InputLabel>
                                <Select
                                value={
                                    selectedItem.habilitado !== undefined
                                    ? String(selectedItem.habilitado)
                                    : ""
                                }
                                onChange={(e) =>
                                    setSelectedItem((prev) => ({
                                    ...prev,
                                    habilitado: e.target.value === "true",
                                    }))
                                }
                                >
                                <MenuItem value="true">Sí</MenuItem>
                                <MenuItem value="false">No</MenuItem>
                                </Select>
                                {erros.habilitado && (
                                <FormHelperText>{erros.habilitado}</FormHelperText>
                                )}
                            </FormControl>
                            </Box>

                            {/* Acciones */}
                            <DialogActions>
                            <Button onClick={closeModal}>Cancelar</Button>
                            <Button type="submit" className="w-auto">
                                Confirmar
                            </Button>
                            </DialogActions>
                        </form>
                        </DialogContent>
                          </Dialog>
                    </React.Fragment>



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
