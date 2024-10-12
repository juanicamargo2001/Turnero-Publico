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
            return Ok(agendaPrevia);


        }

      
    }
}
