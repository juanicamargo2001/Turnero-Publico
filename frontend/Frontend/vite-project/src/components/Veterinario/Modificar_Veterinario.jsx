import React, { useState, useEffect, useContext } from "react";
import Modal from "../Visual_Modificador";
import { veterinarioService } from "../../services/veterinario/veterinario.service";
import UserRoleContext from "../Login/UserRoleContext";
import Swal from "sweetalert2";
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

const Veterinarios = () => {
  const [error, setError] = useState(null);
  const [erros, setErros] = useState({});
  const [data, setData] = useState([]);
  const [leg, setLegajo] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [selectedItem, setSelectedItem] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    fNacimiento: "",
    matricula: "",
    domicilio: "",
    email: "",
    habilitado: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userRole } = useContext(UserRoleContext);

  

  const openModal = (item) => {
    
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // setSelectedItem(null);
  };

  const fetchVeterinarios = async () => {
    try {
      const data = await veterinarioService.BuscarTodos();
      setData(data.result);
    } catch (error) {
      setError(error);
    }
  };

  const StyledTableContainer = styled(TableContainer)({
    margin: "0 auto", // Centra la tabla sin margen extra
    borderRadius: 8,
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    padding: 0, // Asegura que no haya padding extra
  });

  const StyledTable = styled(Table)({
    minWidth: 700,
    borderCollapse: "separate",
    borderSpacing: 0, // Elimina espacios raros entre celdas
  });

  const StyledTableHead = styled(TableHead)(({ theme }) => ({
    backgroundColor: theme.palette.info.main, // Azul del tema
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
      backgroundColor: theme.palette.action.hover, // Fondo alternado
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const handleSubmit = async (event) => {
      event.preventDefault();
  
      let validationErrors = {};
      if (!selectedItem.nombre || selectedItem.nombre.trim() === "")
        validationErrors.nombre = "El nombre es requerido";
    
      if (!selectedItem.apellido || selectedItem.apellido.trim() === "")
        validationErrors.apellido = "El apellido es requerido";
    
      const dniRegex = /^\d{8}$/;
      if (!selectedItem.dni) {
        validationErrors.dni = "El DNI es requerido";
      } else if (!dniRegex.test(selectedItem.dni.toString())) {
        validationErrors.dni = "El DNI debe tener exactamente 8 dígitos";
      }
    
      const telefonoRegex = /^\d{8,15}$/;
      if (!selectedItem.telefono) {
        validationErrors.telefono = "El teléfono es requerido";
      } else if (!telefonoRegex.test(selectedItem.telefono.toString())) {
        validationErrors.telefono = "El teléfono debe contener entre 8 y 15 números";
      }
    
      if (!selectedItem.fNacimiento) {
        validationErrors.fNacimiento = "La fecha de nacimiento es requerida";
      } else {
        const hoy = new Date();
        const nacimiento = new Date(selectedItem.fNacimiento);
        const edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        const dia = hoy.getDate() - nacimiento.getDate();
    
        const tiene18 = edad > 18 || (edad === 18 && (mes > 0 || (mes === 0 && dia >= 0)));
        if (!tiene18) {
          validationErrors.fNacimiento = "El veterinario debe tener al menos 18 años";
        }
      }

      if (Object.keys(validationErrors).length > 0) {
        setErros(validationErrors);
        return;
      }

      try {
          
          let response = await veterinarioService.Modificar(selectedItem, leg);
          console.log(response)
          if (response != null)
            Swal.fire({
              text: "El veterinario se editó correctamente",
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

  useEffect(() => {
    fetchVeterinarios();
  }, []);

  const handleView = (row) => {
    setLegajo(row.idLegajo);
    //MANEJAR ESTO EN UN COMPONENTE ESPECIFICO XD
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
      if (
        formData[elemento] === "" ||
        formData[elemento] === undefined ||
        formData[elemento] === null
      ) {
        c = c + 1;
      }
    });
    if (c === 0) {
      formData.idLegajo = leg;
      formData.fNacimiento =
        formData.fNacimiento.toISOString().split("T")[0] + "T00:00:00";
      //console.log(formData);
      try {
        await veterinarioService.Modificar(formData);
        Swal.fire({
          title: "¡Éxito!",
          text: "Veterinario modificado correctamente",
          icon: "success",
          confirmButtonColor: "#E15562",
          confirmButtonText: "OK",
        }).then(() => {});
        fetchVeterinarios();
      } catch (error) {
        console.error(
          "Error al modificar el veterinario:",
          error.response ? error.response.data : error
        );
      }
    } else {
      Swal.fire({
        text: "Ningun atributo puede estar vacío",
        icon: "info",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => {});
    }
  };

  const manejarBusqueda = async (e) => {
    if (e.type === "click" || (e.type === "keydown" && e.key === "Enter")) {
      if (busqueda === "") {
        fetchVeterinarios();
      } else {
        try {
          const data = await veterinarioService.BuscarPorDni(busqueda);
          setData(data.result);
        } catch (error) {
          Swal.fire({
            text: "Error al buscar veterinarios",
            icon: "info",
            confirmButtonColor: "#E15562",
            confirmButtonText: "OK",
          }).then(() => {});
          setError(error);
          console.error("Error al buscar veterinarios:", error);
        }
      }
    }
  };


  return (
    <div className="container mt-4">
      <h2 className="maven-pro-title text-center mb-4">VETERINARIOS</h2>
      <div
        className="d-flex flex-column flex-md-row align-items-center justify-content-between mb-3"
        style={{ gap: "10px" }}
      >
        {/* Mostrar el botón solo si el rol del usuario no es "Secretaria" */}
        {userRole.rol !== "secretaria" && (
          <a href="/registrar/veterinario" className="mb-2 mb-md-0">
            <button className="btn btn-primary confir w-100 w-md-auto">
              Crear Veterinario
            </button>
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
          <span
            className="input-group-text"
            onClick={manejarBusqueda}
            style={{ cursor: "pointer" }}
          >
            <i className="fa fa-search"></i>
          </span>
        </div>
      </div>
      <StyledTableContainer component={Paper}>
        <StyledTable>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Legajo</StyledTableCell>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell>Apellido</StyledTableCell>
              <StyledTableCell>DNI</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Habilitado</StyledTableCell>
              <StyledTableCell>Teléfono</StyledTableCell>
              {userRole.rol !== "secretaria" && (
              <StyledTableCell>Acciones</StyledTableCell>
            )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {data.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableBodyCell>{row.idLegajo}</StyledTableBodyCell>
                <StyledTableBodyCell>{row.nombre}</StyledTableBodyCell>
                <StyledTableBodyCell>{row.apellido}</StyledTableBodyCell>
                <StyledTableBodyCell>{row.dni}</StyledTableBodyCell>
                <StyledTableBodyCell>{row.email}</StyledTableBodyCell>
                <StyledTableBodyCell>
                  {row.habilitado ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      ✓
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>✗</span>
                  )}
                </StyledTableBodyCell>
                <StyledTableBodyCell>{row.telefono}</StyledTableBodyCell>
                {userRole.rol !== "secretaria" && (
                <StyledTableBodyCell>
                  <IconButton color="primary" onClick={() => handleView(row)}>
                    <a href="#" onClick={() => handleView(row)}>
                      <i
                        title="Modificar"
                        className="fa fa-edit"
                        style={{ fontSize: "1.2rem" }}
                        aria-hidden="true"
                      ></i>
                    </a>
                  </IconButton>
                </StyledTableBodyCell>
              )}
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

                    {/* Apellido */}
                    <Box mb={2}>
                      <TextField
                        label="Apellido"
                        fullWidth
                        variant="standard"
                        value={selectedItem.apellido || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({ ...prev, apellido: e.target.value }))
                        }
                        error={Boolean(erros.apellido)}
                        helperText={erros.apellido}
                      />
                    </Box>

                    {/* DNI */}
                    <Box mb={2}>
                      <TextField
                        label="DNI"
                        fullWidth
                        variant="standard"
                        value={selectedItem.dni || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({ ...prev, dni: e.target.value }))
                        }
                        error={Boolean(erros.dni)}
                        helperText={erros.dni}
                      />
                    </Box>

                    {/* Teléfono */}
                    <Box mb={2}>
                      <TextField
                        label="Teléfono"
                        fullWidth
                        variant="standard"
                        value={selectedItem.telefono || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({ ...prev, telefono: e.target.value }))
                        }
                        error={Boolean(erros.telefono)}
                        helperText={erros.telefono}
                      />
                    </Box>

                    {/* Fecha de nacimiento */}
                    <Box mb={2}>
                      <TextField
                        label="Fecha de Nacimiento"
                        fullWidth
                        variant="standard"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={
                          selectedItem.fNacimiento
                            ? new Date(selectedItem.fNacimiento).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setSelectedItem((prev) => ({
                            ...prev,
                            fNacimiento: e.target.value,
                          }))
                        }
                        error={Boolean(erros.fNacimiento)}
                        helperText={erros.fNacimiento}
                      />
                    </Box>

                    {/* Matrícula */}
                    <Box mb={2}>
                      <TextField
                        label="Matrícula"
                        fullWidth
                        variant="standard"
                        value={selectedItem.matricula || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({ ...prev, matricula: e.target.value }))
                        }
                        error={Boolean(erros.matricula)}
                        helperText={erros.matricula}
                      />
                    </Box>

                    {/* Domicilio */}
                    <Box mb={2}>
                      <TextField
                        label="Domicilio"
                        fullWidth
                        variant="standard"
                        value={selectedItem.domicilio || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({ ...prev, domicilio: e.target.value }))
                        }
                        error={Boolean(erros.domicilio)}
                        helperText={erros.domicilio}
                      />
                    </Box>

                    {/* Email */}
                    <Box mb={2}>
                      <TextField
                        label="Email"
                        fullWidth
                        variant="standard"
                        type="email"
                        value={selectedItem.email || ""}
                        onChange={(e) =>
                          setSelectedItem((prev) => ({ ...prev, email: e.target.value }))
                        }
                        error={Boolean(erros.email)}
                        helperText={erros.email}
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
                          value={selectedItem.habilitado !== undefined ? selectedItem.habilitado : ""}
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
      
      
                    <DialogActions>
                      <Button onClick={closeModal}>Cancelar</Button>
                      <Button type="submit" className="w-auto">Confirmar</Button>
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog>
        </React.Fragment>
    </div>
  );
};

export default Veterinarios;
