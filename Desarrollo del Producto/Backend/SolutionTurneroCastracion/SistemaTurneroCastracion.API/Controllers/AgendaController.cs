using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgendaController : ControllerBase
    {

        private readonly IAgendaRepository _agendaRepository;

        public AgendaController (IAgendaRepository agendaRepository)
        {
            _agendaRepository = agendaRepository;
        }


        [HttpPost]
        public async Task<IActionResult> ObtenerFechasDisponibles([FromBody] AgendaDTO agendaPrevia)
        {
            
            bool agendaRegistrada= await _agendaRepository.RegistrarAgenda(agendaPrevia);

            if (!agendaRegistrada) 
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al registrar las agendas", Result = ""});
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result= ""});
        }

      
    }
}
