using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;



namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TurnosController : ControllerBase
    {
        private readonly ITurnosRepository _turnosRepository;
        private readonly Validaciones _validaciones;
        private readonly IHorariosRepository _horariosRepository;


        public TurnosController(ITurnosRepository turnosRepository, Validaciones validaciones, IHorariosRepository horariosRepository)
        {
            _turnosRepository = turnosRepository;
            _validaciones = validaciones;
            _horariosRepository = horariosRepository;
        }

        [HttpPost]
        public async Task<IActionResult> ObtenerFechasDisponibles([FromBody] TurnoXHorarioRequestDTO turnoXHorario)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<TurnoDTO> turnos = await _turnosRepository.ObtenerTurnosHabiles(turnoXHorario.Id, turnoXHorario.Dia, turnoXHorario.TipoAnimal);

            if (!turnos.Any())
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al consultar los turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnos });
        }

        [HttpPost("obtenerTurnosAnimal")]
        public async Task<IActionResult> ObtenerDiasDisponibles(TurnoXAnimalRequestDTO turnoXAnimalRequest)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<DateTime> turnos = await _turnosRepository.ObtenerDiasTurnos(turnoXAnimalRequest.IdCentroCastracion, turnoXAnimalRequest.TipoAnimal);

            if (!turnos.Any())
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al consultar los turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnos });
        }

        [HttpPost("reservarTurno")]
        public async Task<IActionResult> ReservarTurno(HorarioMascotaDTO horarioMascota)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            bool turnoSacado = await _horariosRepository.SacarTurno(horarioMascota, HttpContext);

            if (!turnoSacado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al querer sacar el turno!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });

        }

        [HttpGet("misTurnos")]
        public async Task<IActionResult> ObtenerMisMascotas()
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<TurnoUsuario> turnosUsuario = await _turnosRepository.ObtenerTurnosUsuario(HttpContext);

            if (turnosUsuario == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al visualizar los turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnosUsuario });

        }


        [HttpPost("cancelarTurno")]
        public async Task<IActionResult> CancelarTurno([FromBody] int idTurno)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            bool cancelado = await _horariosRepository.CancelarTurno(idTurno, HttpContext);

            if (!cancelado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al cancelar el turno!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });

        }

        [HttpPost("confirmarTurno")]
        public async Task<IActionResult> ConfirmarTurno([FromBody] int idTurno)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            bool confirmado = await _horariosRepository.ConfirmarTurno(idTurno, HttpContext);

            if (!confirmado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al confirmar el turno!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }


        [HttpPost("turnosFiltro")]
        public async Task<IActionResult> ObtenerTurnosPorFiltro([FromBody] TurnosSecretariaDTO filtro)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<TurnosFiltradoSecretariaDTO?> horariosEncontrados = await _horariosRepository.ObtenerHorariosFiltrados(filtro, HttpContext);

            if (horariosEncontrados.Count == 0) {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron turnos para esos filtros!", Result = horariosEncontrados });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = horariosEncontrados });
        }


        [HttpPost("confirmarLlegada")]
        public async Task<IActionResult> ConfirmarLlegada([FromBody] int IdHorario) {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            bool ingresado = await _horariosRepository.ConfirmarIngreso(IdHorario);


            if (!ingresado) {

                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al ingresar al animal!", Result = "" });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

        [HttpPost("filtroPorDni")]
        public async Task<IActionResult> ObtenerTurnosPorDNI([FromBody] long dni)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<TurnosFiltradoSecretariaDTO?> turnosFiltrados = await _horariosRepository.ObtenerTurnoPorDNI(dni);

            if (!turnosFiltrados.Any())
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnosFiltrados });

        }


        [HttpPost("turnosCancelados")]
        public async Task<IActionResult> ObtenerTurnosPorDNI([FromBody] TurnosSecretariaDTO filtro)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<HorariosCanceladosResponse> turnosCancelados = await _horariosRepository.ObtenerCanceladosPorCentro(filtro, HttpContext);

            if (!turnosCancelados.Any())
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnosCancelados });

        }


        [HttpPost("turnoEmergencia")]
        public async Task<IActionResult> TurnoEmergencia([FromBody] TurnoUrgenteRequestDTO request) 
        {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            if (!await _horariosRepository.TurnoEmergencia(request))
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al registrar el turno de emergencia!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

    }
}


// crear un horario con la hora actual, tipo de turno Emergencia (3), id turno hay que buscar el id del dia actual, el estado pasa de una a ingresado
// y deberia asignarle el id del usuario pasado por parametro