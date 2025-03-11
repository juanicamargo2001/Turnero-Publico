import { useEffect, useState } from "react";
import gatoImg from "../../imgs/gato.png";
import perroImg from "../../imgs/perro.png";
import mascotaService from "../../services/animal/mascota.service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { sexosService } from "../../services/animal/sexo.service";
import { tipoAnimalService } from "../../services/animal/tipoAnimal.service";
import { tamanoService } from "../../services/animal/tamano.service";
import { DotLoader } from "react-spinners";
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
} from "@mui/material";


const MisMascotas = () => {
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [sexos, setSexo] = useState([]);
  const [tipoAnimales, setTiposAnimal] = useState([]);
  const [tamañoAnimales, setTamañosAnimales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [mascotaEdit, setMascotaEdit] = useState(selectedMascota || {});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchMascotas = async () => {
      let response = await mascotaService.obtenerTodasMisMascotas();
      setMascotas(response.result);
      setIsLoading(false);
    };

    fetchMascotas();
  }, []);

  const cargarDetalleAnimal = async () => {
    setIsLoading(true);
    let responseSexo = await sexosService.Buscar();
    setSexo(responseSexo.result);

    let responseTipoAnimal = await tipoAnimalService.Buscar();
    setTiposAnimal(responseTipoAnimal.result);

    let responseTamaño = await tamanoService.Buscar();
    setTamañosAnimales(responseTamaño.result);
    setIsLoading(false);
  };

  const handleMascotaSelect = (mascota) => {
    setSelectedMascota(mascota);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let validationErrors = {};
    if (!mascotaEdit.nombre) validationErrors.nombre = "El nombre es requerido";
    if (!mascotaEdit.edad) validationErrors.edad = "La edad es requerida";
    if (mascotaEdit.edad < 0 || mascotaEdit.edad > 20)
      validationErrors.edad = "La edad debe estar entre 0 y 20 años";
    if (!mascotaEdit.sexo) validationErrors.sexo = "El sexo es requerido";
    if (!mascotaEdit.tamaño) validationErrors.tamaño = "El tamaño es requerido";
    if (!mascotaEdit.tipoAnimal)
      validationErrors.tipoAnimal = "El tipo de animal es requerido";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        let response = await mascotaService.editarMascota(mascotaEdit);
        if (response != null)
          Swal.fire({
            text: "El animal se editó correctamente",
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
        }).then(() => {
          navigate("/misMascotas");
        });
      }
      handleClose();
    }
  };

  return (
    <div className="container text-center mt-5 page-container">
      {isLoading && (
        <div className="loading-overlay">
          <DotLoader color="#60C1EA" />
        </div>
      )}
      <h1 className="mb-5 maven-pro-title">Lista de Animales</h1>
      <React.Fragment>
        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle className="maven-pro-title" style={{fontSize: "1.36rem"}}>Editar Animal</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Box mb={2}>
                <TextField
                  label="Nombre"
                  fullWidth
                  variant="standard"
                  value={mascotaEdit.nombre || ""}
                  onChange={(e) =>
                    setMascotaEdit((prev) => ({
                      ...prev,
                      nombre: e.target.value,
                    }))
                  }
                  error={Boolean(errors.nombre)}
                  helperText={errors.nombre}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Descripción (opcional)"
                  fullWidth
                  multiline
                  rows={4}
                  variant="standard"
                  value={mascotaEdit.descripcion || ""}
                  onChange={(e) =>
                    setMascotaEdit((prev) => ({
                      ...prev,
                      descripcion: e.target.value,
                    }))
                  }
                  error={Boolean(errors.descripcion)}
                  helperText={errors.descripcion}
                />
              </Box>

              <Box mb={2}>
                <TextField
                  label="Edad"
                  fullWidth
                  variant="standard"
                  type="number"
                  value={mascotaEdit.edad || ""}
                  onChange={(e) =>
                    setMascotaEdit((prev) => ({
                      ...prev,
                      edad: e.target.value,
                    }))
                  }
                  error={Boolean(errors.edad)}
                  helperText={errors.edad}
                />
              </Box>

              <Box mb={2}>
                <FormControl
                  fullWidth
                  variant="standard"
                  error={Boolean(errors.sexo)}
                >
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    value={mascotaEdit.sexo || ""}
                    onChange={(e) =>
                      setMascotaEdit((prev) => ({
                        ...prev,
                        sexo: e.target.value,
                      }))
                    }
                  >
                    {sexos.map((sexo) => (
                      <MenuItem key={sexo.idSexos} value={sexo.sexoTipo}>
                        {sexo.sexoTipo}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.sexo && (
                    <FormHelperText>{errors.sexo}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl
                  fullWidth
                  variant="standard"
                  error={Boolean(errors.tamaño)}
                >
                  <InputLabel>Tamaño</InputLabel>
                  <Select
                    value={mascotaEdit.tamaño || ""}
                    onChange={(e) =>
                      setMascotaEdit((prev) => ({
                        ...prev,
                        tamaño: e.target.value,
                      }))
                    }
                  >
                    {tamañoAnimales.map((tamaño) => (
                      <MenuItem key={tamaño.idTamaño} value={tamaño.tamañoTipo}>
                        {tamaño.tamañoTipo}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tamaño && (
                    <FormHelperText>{errors.tamaño}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <Box mb={2}>
                <FormControl
                  fullWidth
                  variant="standard"
                  error={Boolean(errors.tipoAnimal)}
                >
                  <InputLabel>Tipo de Animal</InputLabel>
                  <Select
                    value={mascotaEdit.tipoAnimal || ""}
                    onChange={(e) =>
                      setMascotaEdit((prev) => ({
                        ...prev,
                        tipoAnimal: e.target.value,
                      }))
                    }
                  >
                    {tipoAnimales.map((tipoAnimal) => (
                      <MenuItem
                        key={tipoAnimal.idTipo}
                        value={tipoAnimal.tipoAnimal}
                      >
                        {tipoAnimal.tipoAnimal}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tipoAnimal && (
                    <FormHelperText>{errors.tipoAnimal}</FormHelperText>
                  )}
                </FormControl>
              </Box>

              <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button type="submit" className="w-auto">Confirmar</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Lista de Animales */}
        <div
          className={`row ${
            mascotas.length === 1 ? "justify-content-center" : ""
          }`}
        >
          {mascotas.length > 0 ? (
            mascotas.map((mascota) => (
              <div
                key={mascota.idMascota}
                className="col-md-6 mb-4 d-flex justify-content-center"
              >
                <div
                  className={`card tipoAnimal text-center ${
                    selectedMascota?.idMascota === mascota.idMascota
                      ? "selected"
                      : ""
                  }`}
                  style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
                  onClick={() => handleMascotaSelect(mascota)}
                >
                  <img
                    src={mascota.tipoAnimal === "GATO" ? gatoImg : perroImg}
                    className="card-img-top"
                    alt={mascota.tipoAnimal.toLowerCase()}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {mascota.nombre
                        ? mascota.nombre.toUpperCase()
                        : "SIN NOMBRE"}
                    </h5>
                    <p className="card-text">
                      {mascota.descripcion
                        ? mascota.descripcion
                        : "Sin descripción"}
                    </p>
                    <button
                      type="button"
                      className="btn btn-info btn-sm mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMascotaEdit({ ...mascota });
                        setSelectedMascota(mascota);
                        cargarDetalleAnimal();
                        handleClickOpen();
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="alert text-center">
              <p className="mb-3">
                No hay mascotas registradas. Por favor, registre una.
              </p>
              <button
                type="button"
                className="btn btn-primary confir"
                onClick={() => navigate("/registrar/animal")}
              >
                Ir
              </button>
            </div>
          )}
        </div>
      </React.Fragment>
    </div>
  );
};

export default MisMascotas;
