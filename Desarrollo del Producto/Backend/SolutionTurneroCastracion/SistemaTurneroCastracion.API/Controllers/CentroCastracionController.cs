using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.DAL.Implementacion;
using Microsoft.AspNetCore.Authorization;
using SistemaTurneroCastracion.BLL;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CentroCastracionController : ControllerBase
    {
        private readonly ICentroCastracionRepository _centroCastracionRepository;
        private readonly Validaciones _validaciones;

        public CentroCastracionController(ICentroCastracionRepository centroCastracionRepository, Validaciones validaciones)
        {

            _centroCastracionRepository = centroCastracionRepository;
            _validaciones = validaciones;
        }

        [HttpGet]
        public async Task<IActionResult> obtenerCentros()
        {
            List<CentroCastracion> centroCastracions = await _centroCastracionRepository.ObtenerTodos();

            if (centroCastracions.Count == 0)
            {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontraron centros de castracion!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = centroCastracions });
        }

        [Authorize]
        [HttpGet("centroXveterinario")]
        public async Task<IActionResult> obtenerCentrosXVeterinario(int idCentro)
        {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "administrador", "superAdministrador"] );

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            CentroCastracionDTO centroCastracions = await _centroCastracionRepository.obtenerCentroVeterinarios(idCentro);

            if (centroCastracions == null)
            {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró ese centro de castración !", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = centroCastracions });
        }


        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> obtenerCentroId(int id)
        {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            CentroCastracion centro= await _centroCastracionRepository.ObtenerPorId(id);

            if (centro == null)
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró un centro de castración con ese id", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = centro });

        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> crearCentroCastracion([FromBody] CentroCastracion centroCastracion)
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


            if (centroCastracion == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            CentroCastracion centroCreado = await _centroCastracionRepository.Crear(centroCastracion);

            if (centroCreado == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crearlo!", Result = "" });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = centroCreado });

        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> editarCentroCastracion([FromBody] CentroCastracion centroCastracionEditar)
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


            if (centroCastracionEditar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            bool editado = await _centroCastracionRepository.Editar(centroCastracionEditar);

            if (!editado)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al editarlo!", Result = "" });
            }

            return NoContent();

        }

        [Authorize]
        [HttpDelete("deshabilitar/{id}")]
        public async Task<IActionResult> deshabilitarCentro(int id)
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

            CentroCastracion centroEliminar = await _centroCastracionRepository.ObtenerPorId(id);

            if (centroEliminar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al querer deshabilitar el centro de castración!", Result = "" });
            }
            centroEliminar.Habilitado = false;

            bool borrado = await _centroCastracionRepository.Editar(centroEliminar);

            if (!borrado) return Problem(detail: "Error inesperado!", statusCode: StatusCodes.Status500InternalServerError);

            return NoContent();

        }

        [Authorize]
        [HttpPut("habilitar/{id}")]
        public async Task<IActionResult> habilitarVeterinario(int id)
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

            CentroCastracion centroHabilitar = await _centroCastracionRepository.ObtenerPorId(id);

            if (centroHabilitar == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al querer habilitar el centro de castración!", Result = "" });
            }
            centroHabilitar.Habilitado = true;

            bool borrado = await _centroCastracionRepository.Editar(centroHabilitar);

            if (!borrado) return Problem(detail: "Error inesperado!", statusCode: StatusCodes.Status500InternalServerError);

            return NoContent();

        }
    }
}
