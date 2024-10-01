using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using SistemaTurneroCastracion.Entity;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VeterinarioController : ControllerBase
    {
        private readonly IVeterinarioRepository _veterinarioRepository;

        public VeterinarioController(IVeterinarioRepository veterinarioRepository)
        {
            _veterinarioRepository = veterinarioRepository;
        }

        [HttpGet]
        public async Task<IActionResult> obtenerVeterinarios()
        {
            List<Veterinario> veterinarios = await _veterinarioRepository.ObtenerTodos();

            if (veterinarios.Count == 0)
            {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron veterinarios!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = veterinarios });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> obtenerVeterinarioById(int id)
        {
            Veterinario veterinario = await _veterinarioRepository.ObtenerPorId(id);

            if (veterinario == null)
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un veterinario con ese id", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = veterinario });

        }


        [HttpPost]
        public async Task<IActionResult> crearVeterinario([FromBody] Veterinario veterinarioCrear)
        {
            if (veterinarioCrear == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            Veterinario veterinarioCreado = await _veterinarioRepository.Crear(veterinarioCrear);

            if (veterinarioCreado == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crearlo!", Result = "" });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = veterinarioCreado });

        }


        [HttpPut]
        public async Task<IActionResult> editarVeterinario([FromBody] Veterinario veterinarioEditar)
        {
            if (veterinarioEditar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            bool editado = await _veterinarioRepository.Editar(veterinarioEditar);

            if (!editado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al editarlo!", Result = "" });
            }

            return NoContent();

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> borrarVeterinario(int id)
        {
            if (id == 0) return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Falto ingresar el id o no es valido!", Result = "" });

            Veterinario veterinarioEliminar = await _veterinarioRepository.ObtenerPorId(id);

            if (veterinarioEliminar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un veterinario con ese id asociado!", Result = "" });
            }

            veterinarioEliminar.Habilitado = false;

            bool borrado = await _veterinarioRepository.Editar(veterinarioEliminar);

            if (!borrado) return Problem(detail: "Error inesperado!", statusCode: StatusCodes.Status500InternalServerError);

            return NoContent();

        }


        [HttpPut("habilitar/{id}")]
        public async Task<IActionResult> habilitarVeterinario(int id)
        {
            if (id == 0) return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Falto ingresar el id o no es valido!", Result = "" });

            Veterinario veterinarioHabilitar = await _veterinarioRepository.ObtenerPorId(id);

            if (veterinarioHabilitar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un veterinario con ese id asociado!", Result = "" });
            }

            veterinarioHabilitar.Habilitado = true;

            bool borrado = await _veterinarioRepository.Editar(veterinarioHabilitar);

            if (!borrado) return Problem(detail: "Error inesperado!", statusCode: StatusCodes.Status500InternalServerError);

            return NoContent();

        }

        [HttpGet("/veterinario/{dni}")]
        public async Task<IActionResult> buscarVeterinario(int dni)
        {
            if (dni == 0) return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Falto ingresar el dni o no es valido!", Result = "" });

            List<Veterinario> veterinariosBuscados = await _veterinarioRepository.buscarPorDocumento(dni); 

            if (veterinariosBuscados == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un veterinario con ese dni asociado!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = veterinariosBuscados });

        }

    }
}
