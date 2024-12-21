using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalificacionController : ControllerBase
    {
        private readonly ICalificacionRepository _calificacionRepository;
        private readonly Validaciones _validaciones;

        public CalificacionController(ICalificacionRepository calificacionRepository, Validaciones validaciones)
        {
            _calificacionRepository = calificacionRepository;
            _validaciones = validaciones;
        }

        [Authorize]
        [HttpPost("crearCalificacion")]
        public async Task<IActionResult> CrearCalificacion([FromBody] RequestCalificacion request)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.vecino.ToString(), 
                                                                                                       RolesEnum.secretaria.ToString(), 
                                                                                                       RolesEnum.superAdministrador.ToString()]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            bool calificacionRegistrada = await _calificacionRepository.CrearCalificacion(request, HttpContext);

            if (!calificacionRegistrada)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crear la calificación", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

        [Authorize]
        [HttpPost("calificacionXCentro")]
        public async Task<IActionResult> CalificacionXCentro([FromBody] int CentroCastracion)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.secretaria.ToString(),
                                                                                                       RolesEnum.superAdministrador.ToString()]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            List<ResponseCalificacion?> calificaciones = await _calificacionRepository.ObtenerCalificacionesXCentro(CentroCastracion);

            if (calificaciones.Count == 0)
            {
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al obtener las calificaciones", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = calificaciones });
        }



    }
}
