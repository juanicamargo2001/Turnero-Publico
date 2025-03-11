import { useState, useEffect, useContext } from "react";
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
} from "@mui/material";

const Veterinarios = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [leg, setLegajo] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userRole } = useContext(UserRoleContext);

  const openModal = (item) => {
    console.log(item);
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
      console.log(formData);
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
      {/* <table className='responsive-table'>
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
            </table> */}
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
              <StyledTableCell>Acciones</StyledTableCell>
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
    </div>
  );
};

export default Veterinarios;
