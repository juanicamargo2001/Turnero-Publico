using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using SistemaTurneroCastracion.Entity;
using Microsoft.AspNetCore.Authorization;
using SistemaTurneroCastracion.DAL.Implementacion;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TipoAnimalController : ControllerBase
    {
        private readonly ITipoAnimalRepository _tipoAnimalRepository;
        private readonly Validaciones _validaciones;

        public TipoAnimalController(ITipoAnimalRepository tipoAnimalRepository, Validaciones validaciones)
        {
            _tipoAnimalRepository = tipoAnimalRepository;
            _validaciones = validaciones;

        }

        
        [HttpGet]
        public async Task<IActionResult> obtenerTipoAnimal()
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


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
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

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
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

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
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

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
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

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
