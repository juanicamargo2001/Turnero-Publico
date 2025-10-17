using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SexoController : ControllerBase
    {
            
        private readonly ISexoRepository _sexoRepository;
        private readonly Validaciones _validaciones;

        public SexoController(ISexoRepository sexoRepository, Validaciones validaciones) {
        
            _sexoRepository = sexoRepository;
            _validaciones = validaciones;
        
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> obtenerSexo()
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

            List<Sexo> sexos = await _sexoRepository.ObtenerTodos();

            if (sexos.Count == 0) {

                return NotFound(new ValidacionResultadosDTO {Success = false, Message = "No se encontraron sexos!", Result = ""});
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = sexos });
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> obtenerSexoById(int id)
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


            Sexo sexo = await _sexoRepository.ObtenerPorId(id);

            if (sexo == null)
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un sexo con ese id", Result = "" });    
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = sexo });

        }


        [HttpPost]
        public async Task<IActionResult> crearSexo([FromBody] Sexo sexoNuevo)
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

            if (sexoNuevo == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            Sexo sexoCreado = await _sexoRepository.Crear(sexoNuevo);

            if (sexoCreado == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crearlo!", Result = "" });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = sexoCreado });

        }

        
        [HttpPut]
        public async Task<IActionResult> editarSexo([FromBody] Sexo sexoEditar)
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


            if (sexoEditar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            bool editado = await _sexoRepository.Editar(sexoEditar);

            if (!editado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al editarlo!", Result = "" });
            }

            return NoContent();

        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> borrarSexo(int id)
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

            Sexo sexoEliminar = await _sexoRepository.ObtenerPorId(id);

            if (sexoEliminar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un Sexo con ese id asociado!", Result = "" });
            }

            bool borrado = await _sexoRepository.Eliminar(sexoEliminar);

            if (!borrado) return Problem(detail: "Error inesperado!", statusCode: StatusCodes.Status500InternalServerError);

            return NoContent();

        }
    }
}
