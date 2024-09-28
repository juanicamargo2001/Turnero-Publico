using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using SistemaTurneroCastracion.Entity;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TamañoController : ControllerBase
    {
        private readonly ITamañoRepository _tamañoRepository;

        public TamañoController(ITamañoRepository tamañoRepository)
        {

            _tamañoRepository = tamañoRepository;

        }

        [HttpGet]
        public async Task<IActionResult> obtenerTamaños()
        {
            List<Tamaño> tamaños = await _tamañoRepository.ObtenerTodos();

            if (tamaños.Count == 0)
            {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron tamaños!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = tamaños });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> obtenerTamañoById(int id)
        {
            Tamaño tamaño = await _tamañoRepository.ObtenerPorId(id);

            if (tamaño == null)
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un tamaño con ese id", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = tamaño });

        }


        [HttpPost]
        public async Task<IActionResult> crearTamaño([FromBody] Tamaño tamañoCrear)
        {
            if (tamañoCrear == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            Tamaño tamañoCreado= await _tamañoRepository.Crear(tamañoCrear);

            if (tamañoCreado == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crearlo!", Result = "" });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = tamañoCreado });

        }


        [HttpPut]
        public async Task<IActionResult> editarTamaño([FromBody] Tamaño tamañoEditar)
        {
            if (tamañoEditar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            bool editado = await _tamañoRepository.Editar(tamañoEditar);

            if (!editado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al editarlo!", Result = "" });
            }

            return NoContent();

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> borrarTamaño(int id)
        {
            if (id == 0) return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Falto ingresar el id o no es valido!", Result = "" });

            Tamaño tamañoEliminar = await _tamañoRepository.ObtenerPorId(id);

            if (tamañoEliminar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un tamaño con ese id asociado!", Result = "" });
            }

            bool borrado = await _tamañoRepository.Eliminar(tamañoEliminar);

            if (!borrado) return Problem(detail: "Error inesperado!", statusCode: StatusCodes.Status500InternalServerError);

            return NoContent();

        }
    }
}
