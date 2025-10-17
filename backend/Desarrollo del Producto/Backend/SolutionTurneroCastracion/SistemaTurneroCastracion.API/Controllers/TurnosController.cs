using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
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


        [HttpPost("turnoTelefonico")]
        public async Task<IActionResult> ReservarTurnoTelefonico([FromBody] HorarioMascotaTelefonoDTO request) {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            HorarioMascotaDTO horarioMascota = new HorarioMascotaDTO() { IdTurnoHorario = request.IdTurnoHorario,
                                                                         IdMascota = request.IdMascota};


            if (!await _horariosRepository.SacarTurno(horarioMascota, null, request.IdUsuario))
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al querer sacar el turno!", Result = "" });

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
        public async Task<IActionResult> CancelarTurno([FromBody] CancelacionRequestDTO request)
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

            bool cancelado = await _horariosRepository.CancelarTurno(request, HttpContext);

            if (!cancelado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al cancelar el turno!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });

        }

        [AllowAnonymous]
        [HttpPost("confirmarTurno")]
        public async Task<IActionResult> ConfirmarTurno([FromBody] string token)
        {

            bool confirmado = await _horariosRepository.ConfirmarTurno(token);

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
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", RolesEnum.administrador.ToString(), "superAdministrador"]);

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
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<HorariosCanceladosResponse> turnosCancelados = await _horariosRepository.ObtenerCanceladosPorCentro(filtro);

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

            if (!await _horariosRepository.TurnoEmergencia(request, HttpContext))
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al registrar el turno de emergencia!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

        [HttpPost("finalizarTurno")]
        public async Task<IActionResult> FinalizarTurnoPostOperatorio([FromBody] FinalizarTurnoDTO request)
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

            if (!await _horariosRepository.FinalizarHorario(request))
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al finalizar el turno!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

        [HttpPost("cancelacionMasiva")]
        public async Task<IActionResult> CancelacionMasiva([FromBody] RequestCancelacionesMasivas request)
        {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.administrador.ToString(), "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            if (!await _horariosRepository.CancelacionMasiva(request))
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al cancelar los turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }


        [AllowAnonymous]
        [HttpPost("ObtenerTurnoPorToken")]
        public async Task<IActionResult> ObtenerTurnoToken([FromBody] string token)
        {
            TurnoTokenResponse? turnoToken = await _turnosRepository.ObtenerInformacionTurnoPorToken(token);

            if (turnoToken is null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al obtener la información del turno!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnoToken });
        }


        [Authorize]
        [HttpPost("finalizarFallido")]
        public async Task<IActionResult> FinalizarTurnoIngresoFallido([FromBody] FinalizarTurnoFallidoRequest request)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, 
                [RolesEnum.secretaria.ToString(), RolesEnum.administrador.ToString(), RolesEnum.superAdministrador.ToString()]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            if (!await _horariosRepository.FinalizarTurnoFallido(request))
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al finalizar el turno fallido!", Result = "" });

            return NoContent();
        }

        [Authorize]
        [HttpPost("obtenerFinalizacionTurno")]
        public async Task<IActionResult> ObtenerFinalizacionTurno([FromBody] int idHorario)
        {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext,
                [RolesEnum.secretaria.ToString(), RolesEnum.administrador.ToString(), RolesEnum.superAdministrador.ToString()]);
            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            InformacionTurnoFinalizadoDTO? turnoFinalizado = await _horariosRepository.ObtenerTurnoFinalizacion(idHorario);

            if(turnoFinalizado == null)
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al obtener la información del turno finalizado!", Result = "" });

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnoFinalizado });

        }

    }
}