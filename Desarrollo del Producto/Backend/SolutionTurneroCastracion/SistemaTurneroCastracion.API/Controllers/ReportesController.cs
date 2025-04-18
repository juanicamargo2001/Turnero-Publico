using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly IReportesRepository _reportesRepository;
        private readonly Validaciones _validaciones;

        public ReportesController(IReportesRepository reportesRepository, Validaciones validaciones)
        {
            _reportesRepository = reportesRepository;
            _validaciones = validaciones;
        }



        [Authorize]
        [HttpPost("informesTipoAnimal")]
        public async Task<IActionResult> InformeTipoAnimal([FromBody] FechasReporteRequest request)
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


            ResponseInformeAnimales? informe = await _reportesRepository.ObtenerCantidadesTiposAnimales(request);

            if (informe == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crear el informe", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = informe });
        }


        [Authorize]
        [HttpPost("informesCancelaciones")]
        public async Task<IActionResult> InformeCancelaciones([FromBody] FechasReporteRequest request)
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


            ResponseInformeCancelacion? informe = await _reportesRepository.ObtenerCantidadCancelaciones(request);

            if (informe == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crear el informe", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = informe });
        }

        [Authorize]
        [HttpPost("informesRaza")]
        public async Task<IActionResult> informesRazaPerro([FromBody] FechasReporteRequest request, [FromQuery] string tipoAnimal)
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


            List<ResponseInformeRazas>? informe = await _reportesRepository.ObtenerCantidadRazaCastrados(request, tipoAnimal);

            if (informe == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crear el informe", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = informe });
        }
    }
}

