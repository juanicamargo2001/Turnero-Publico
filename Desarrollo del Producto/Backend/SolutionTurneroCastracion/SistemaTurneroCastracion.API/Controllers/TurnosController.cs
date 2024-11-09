using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

            List<TurnoDTO> turnos= await _turnosRepository.ObtenerTurnosHabiles(turnoXHorario.Id, turnoXHorario.Dia);

            if (!turnos.Any())
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al consultar los turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnos });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerDiasDisponibles(int id)
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

            List<DateTime> turnos= await _turnosRepository.ObtenerDiasTurnos(id);

            if (!turnos.Any())
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al consultar los turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnos });
        }

        [HttpPost("reservarTurno")]
        public async Task<IActionResult> ReservarTurno(int id_horario_turno)
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

            bool turnoSacado = await _horariosRepository.SacarTurno(id_horario_turno, HttpContext);

            if (!turnoSacado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error querer sacar el turno!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });

        }


    }
}
