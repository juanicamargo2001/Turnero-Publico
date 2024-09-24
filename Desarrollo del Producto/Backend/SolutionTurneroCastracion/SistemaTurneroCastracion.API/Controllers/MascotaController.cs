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


        public MascotaController (IMascotaRepository mascotarepository)
        {
            _mascotaRepository = mascotarepository;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerMascotas()
        {
            try
            {
                List<MascotaDTO> mascotas = await _mascotaRepository.obtenerMascotasDueño();

                if (mascotas == null) {

                    return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontro ninguna Mascota", Result = "" });
                }

                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = mascotas });

            }
            catch (Exception ex) { 
                return BadRequest(new ValidacionResultadosDTO { Success = true, Message = "Sucedio un error inesperado!", Result = "" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CrearMascota([FromBody] Mascota mascota)
        {
            try
            {
                Mascota mascotaCreada = await _mascotaRepository.Crear(mascota);

                if (mascotaCreada == null) {
                    return NotFound(new ValidacionResultadosDTO {Success = false, Message= "No se pudo registrar correctamente la mascota!", Result = ""});
                }
                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = mascotaCreada });

            }
            catch (Exception ex)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });
            }

        }

        [HttpDelete]
        public async Task<IActionResult> BorrarMascota([FromBody] int id)
        {
            try
            {
                Mascota mascotaEliminar = await _mascotaRepository.ObtenerPorId(id);

                bool borrado = await _mascotaRepository.Eliminar(mascotaEliminar);

                if (!borrado) {
                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al intentar borrar la mascota o no existe!", Result = "" });
                }

                return NoContent();

            }
            catch (Exception ex)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = true, Message = "Sucedio un error inesperado!", Result = "" });
            }

        }

        //[HttpPut("{id}")]
        //public async Task<IActionResult> EditarMascota(int id, MascotaDTO mascotaDto)
        //{
        //    if (id != mascotaDto.idMascota)
        //    {
        //        return BadRequest("El ID proporcionado no coincide con el ID de la mascota.");
        //    }

        //    var mascota = await _mascotaRepository.ObtenerPorId(id);

        //    if (mascota == null)
        //    {
        //        return NotFound("La mascota no se encontró.");
        //    }

        //    // Mapear mascotaDto a la entidad Mascota
        //    mascota.idTipoAnimal = mascotaDto.idTipoAnimal;
        //    mascota.idSexo = mascotaDto.idSexo;
        //    mascota.idTamaño = mascotaDto.idTamaño;
        //    mascota.idVecino = mascotaDto.idVecino;
        //    mascota.edad = mascotaDto.edad;
        //    mascota.nombre = mascotaDto.nombre;
        //    mascota.descripcion = mascotaDto.descripcion;

        //    bool resultado = await _repository.Editar(mascota);

        //    if (resultado)
        //    {
        //        return NoContent(); 
        //    }
        //}

    }
}
