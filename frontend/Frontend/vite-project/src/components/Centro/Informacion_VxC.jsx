import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";



export default function Informacion_VxC({ veterinarios, nombreCentro }) {
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
  
  return (
    
    <div className="veterinarios-info mt-3 mt-4 text-center">
      <h5 className="mb-3 mt-5">Veterinarios del centro {nombreCentro}</h5>
      {veterinarios.length > 0 ? (
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
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {veterinarios.map((vet, index) => (
                <StyledTableRow key={index}>
                  <StyledTableBodyCell>{vet.idLegajo}</StyledTableBodyCell>
                  <StyledTableBodyCell>{vet.nombre}</StyledTableBodyCell>
                  <StyledTableBodyCell>{vet.apellido}</StyledTableBodyCell>
                  <StyledTableBodyCell>{vet.dni}</StyledTableBodyCell>
                  <StyledTableBodyCell>{vet.email}</StyledTableBodyCell>
                  <StyledTableBodyCell className="text-center">
                    {vet.habilitado ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        ✓
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        ✗
                      </span>
                    )}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>{vet.telefono}</StyledTableBodyCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </StyledTable>
        </StyledTableContainer>
      ) : (
        <p>No hay veterinarios disponibles</p>
      )}
    </div>
  );
}
