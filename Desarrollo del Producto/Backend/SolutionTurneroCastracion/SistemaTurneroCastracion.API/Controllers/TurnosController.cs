using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;



namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnosController : ControllerBase
    {
        private readonly ITurnosRepository _turnosRepository;


        public TurnosController(ITurnosRepository turnosRepository)
        {
            _turnosRepository = turnosRepository;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerFechasDisponibles(int id)
        {

            List<TurnoDTO> turnos= await _turnosRepository.ObtenerTurnosHabiles(id);

            if (!turnos.Any())
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al consultar los turnos!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = turnos });
        }
    }
}
