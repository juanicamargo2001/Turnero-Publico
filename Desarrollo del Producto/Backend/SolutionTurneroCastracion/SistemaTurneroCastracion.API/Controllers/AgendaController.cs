using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgendaController : ControllerBase
    {

        private readonly IAgendaRepository _agendaRepository;
        private readonly Validaciones _validaciones;

        public AgendaController (IAgendaRepository agendaRepository, Validaciones validaciones)
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


            bool agendaRegistrada= await _agendaRepository.RegistrarAgenda(agendaPrevia);

            if (!agendaRegistrada) 
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al registrar las agendas", Result = ""});
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result= ""});
        }

      
    }
}
