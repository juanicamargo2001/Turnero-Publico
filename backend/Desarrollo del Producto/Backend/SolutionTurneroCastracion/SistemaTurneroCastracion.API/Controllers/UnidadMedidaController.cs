using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using SistemaTurneroCastracion.Entity;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnidadMedidaController : ControllerBase
    {
        private readonly IUnidadMedidaRepository _unidadMedidaRepository;
        private readonly Validaciones _validaciones;

        public UnidadMedidaController(IUnidadMedidaRepository unidadMedidaRepository, Validaciones validaciones)
        {
            _unidadMedidaRepository = unidadMedidaRepository;
            _validaciones = validaciones;
        }


        [Authorize]
        [HttpPost("crearUnidadMedida")]
        public async Task<IActionResult> CrearMedicamento([FromBody] string unidad)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.secretaria.ToString(),
                                                                                                       RolesEnum.administrador.ToString(),
                                                                                                       RolesEnum.superAdministrador.ToString()]);
            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            if (!await _unidadMedidaRepository.CrearUnidad(unidad))
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se pudo registrar correctamente la unidad de medida!", Result = "" });

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }


        [Authorize]
        [HttpGet("obtenerUnidadesMedida")]
        public async Task<IActionResult> ObtenerMedicamentos()
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.secretaria.ToString(),
                                                                                                       RolesEnum.administrador.ToString(),
                                                                                                       RolesEnum.superAdministrador.ToString()]);
            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<UnidadMedida> unidadMedidas = await _unidadMedidaRepository.ObtenerTodos();

            if (unidadMedidas.Count == 0)
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al buscar las unidades de medida", Result = "" });


            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = unidadMedidas });
        }

    }
}
