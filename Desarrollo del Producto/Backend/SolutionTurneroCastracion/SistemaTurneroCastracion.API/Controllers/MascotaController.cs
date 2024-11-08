using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.DAL.Implementacion;
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
        private readonly Validaciones _validaciones;

        public MascotaController(IMascotaRepository mascotarepository, Validaciones validaciones)
        {
            _mascotaRepository = mascotarepository;
            _validaciones = validaciones;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> ObtenerMascotas()
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            try
            {
                List<MascotaDTO> mascotas = await _mascotaRepository.obtenerMascotasDueño();

                if (mascotas.Count == 0)
                {

                    return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró ninguna Mascota", Result = "" });
                }

                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = mascotas });

            }
            catch
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });
            }
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CrearMascota([FromBody] MascotaDTO mascota)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


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

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> obtenerMascotaPorId(int id)
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


            try
            {
                MascotaDTO mascotaId = await _mascotaRepository.obtenerMascotasDueñoById(id);

                if (mascotaId == null)
                {
                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró la mascota!", Result = "" });
                }

                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = mascotaId });
            }
            catch
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });
            }

        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> EditarMascota(MascotaDTO mascotaDto)
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
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" }); 
            }
        }


    }

}

