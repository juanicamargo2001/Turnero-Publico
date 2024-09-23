using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MascotaController : ControllerBase
    {

        private readonly IMascotaRepository _mascotaRepository;


        public MascotaController (IMascotaRepository mascotarepository)
        {
            _mascotaRepository = mascotarepository;
        }

        [HttpGet]
        public async Task<IActionResult> obtenerMascotas()
        {
            try
            {
                List<Mascota> mascotas = await _mascotaRepository.ObtenerTodos();

                if (mascotas == null) {

                    return NotFound("No se encontraron Mascotas");
                }

                return Ok(mascotas);

            }
            catch (Exception ex) { 
                return BadRequest("Sucedio un error inesperado");
            }


        }
    }
}
