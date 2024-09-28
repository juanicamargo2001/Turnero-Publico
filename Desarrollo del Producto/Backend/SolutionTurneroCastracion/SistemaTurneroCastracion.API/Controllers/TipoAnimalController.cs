using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using SistemaTurneroCastracion.Entity;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TipoAnimalController : ControllerBase
    {
        private readonly ITipoAnimalRepository _tipoAnimalRepository;

        public TipoAnimalController(ITipoAnimalRepository tipoAnimalRepository)
        {

            _tipoAnimalRepository = tipoAnimalRepository;

        }

        [HttpGet]
        public async Task<IActionResult> obtenerTipoAnimal()
        {
            List<TiposAnimal> tiposAnimales= await _tipoAnimalRepository.ObtenerTodos();

            if (tiposAnimales.Count == 0)
            {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron tipo de animales!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = tiposAnimales });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> obtenerTipoAnimalById(int id)
        {
            TiposAnimal tiposAnimal = await _tipoAnimalRepository.ObtenerPorId(id);

            if (tiposAnimal == null)
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un tipo de animal con ese id", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = tiposAnimal });

        }


        [HttpPost]
        public async Task<IActionResult> crearTipoAnimal([FromBody] TiposAnimal tiposAnimalCrear)
        {
            if (tiposAnimalCrear == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            TiposAnimal tipoAnimalCreado = await _tipoAnimalRepository.Crear(tiposAnimalCrear);

            if (tipoAnimalCreado == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crearlo!", Result = "" });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = tipoAnimalCreado });

        }


        [HttpPut]
        public async Task<IActionResult> editarTipoAnimal([FromBody] TiposAnimal tiposAnimalEditar)
        {
            if (tiposAnimalEditar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            bool editado = await _tipoAnimalRepository.Editar(tiposAnimalEditar);

            if (!editado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al editarlo!", Result = "" });
            }

            return NoContent();

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> borrarTipoAnimal(int id)
        {
            if (id == 0) return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Falto ingresar el id o no es valido!", Result = "" });

            TiposAnimal tipoAnimalEliminar = await _tipoAnimalRepository.ObtenerPorId(id);

            if (tipoAnimalEliminar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un tipo animal con ese id asociado!", Result = "" });
            }

            bool borrado = await _tipoAnimalRepository.Eliminar(tipoAnimalEliminar);

            if (!borrado) return Problem(detail: "Error inesperado!", statusCode: StatusCodes.Status500InternalServerError);

            return NoContent();

        }
    }
}
