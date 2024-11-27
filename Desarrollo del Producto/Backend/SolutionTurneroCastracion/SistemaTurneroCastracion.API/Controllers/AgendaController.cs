using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System.Numerics;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgendaController : ControllerBase
    {

        private readonly IAgendaRepository _agendaRepository;
        private readonly Validaciones _validaciones;

        public AgendaController(IAgendaRepository agendaRepository, Validaciones validaciones)
        {
            _agendaRepository = agendaRepository;
            _validaciones = validaciones;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> ObtenerFechasDisponibles([FromBody] AgendaDTO agendaPrevia)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            bool agendaRegistrada = await _agendaRepository.RegistrarAgenda(agendaPrevia);

            if (!agendaRegistrada)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al registrar las agendas", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> EliminarAgendaConTurnos([FromBody] AgendaBorradoRequest borradoRequest ) {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            bool borrado = await _agendaRepository.EliminarAgenda(borradoRequest);


            if (!borrado)
            { 
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al elimianr las agendas", Result = "" });
            }


            return NoContent();
        }

        [Authorize]
        [HttpPost("AgendaXCentro")]
        public async Task<IActionResult> ObtenerAgendasXCentro([FromBody] int idCentro)
        {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<Agenda?> agendasXCentro = await _agendaRepository.AgendaXCentro(idCentro);

            if (agendasXCentro.Count == 0)
            {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron agendas", Result = agendasXCentro });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = agendasXCentro });
        }


    }
}
