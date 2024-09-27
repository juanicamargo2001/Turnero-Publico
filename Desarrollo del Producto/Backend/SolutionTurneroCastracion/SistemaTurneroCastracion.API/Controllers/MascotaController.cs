using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MascotaController : ControllerBase
    {

        private readonly IMascotaRepository _mascotaRepository;


        public MascotaController(IMascotaRepository mascotarepository)
        {
            _mascotaRepository = mascotarepository;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerMascotas()
        {
            try
            {
                List<MascotaDTO> mascotas = await _mascotaRepository.obtenerMascotasDueño();

                if (mascotas == null)
                {

                    return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontro ninguna Mascota", Result = "" });
                }

                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = mascotas });

            }
            catch
            {
                return BadRequest(new ValidacionResultadosDTO { Success = true, Message = "Sucedio un error inesperado!", Result = "" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CrearMascota([FromBody] MascotaDTO mascota)
        {
            try
            {
                Mascota mascotaCreada = await _mascotaRepository.crearMascota(mascota);

                if (mascotaCreada == null)
                {
                    return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se pudo registrar correctamente la mascota!", Result = "" });
                }
                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = mascotaCreada });

            }
            catch
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });
            }

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> obtenerMascotaPorId(int id)
        {
            try
            {
                MascotaDTO mascotaId = await _mascotaRepository.obtenerMascotasDueño(id);

                if (mascotaId == null)
                {
                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró la mascota!", Result = "" });
                }

                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = mascotaId });
            }
            catch
            {
                return BadRequest(new ValidacionResultadosDTO { Success = true, Message = "Sucedio un error inesperado!", Result = "" });
            }

        }
        [HttpPut]
        public async Task<IActionResult> EditarMascota(MascotaDTO mascotaDto)
        {
            try
            {
                bool resultado = await _mascotaRepository.editarMascotaPorId(mascotaDto);

                if (!resultado)
                {
                    return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró una mascota con ese id!", Result = "" });
                }


                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
            }
            catch { 
                return BadRequest(new ValidacionResultadosDTO { Success = true, Message = "Sucedio un error inesperado!", Result = "" }); 
            }
        }


    }

}

