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
    public class MedicamentoController : ControllerBase
    {
        private readonly IMedicamentoRepository _medicamentoRepository;
        private readonly Validaciones _validaciones;
        private readonly IMedicamentoxhorarioRepository _medicamentoxhorarioRepository;

        public MedicamentoController(IMedicamentoRepository medicamentoRepository, Validaciones validaciones, IMedicamentoxhorarioRepository medicamentoxhorarioRepository)
        {
            _medicamentoRepository = medicamentoRepository;
            _validaciones = validaciones;
            _medicamentoxhorarioRepository = medicamentoxhorarioRepository;
        }


        [Authorize]
        [HttpPost("crearMedicamento")]
        public async Task<IActionResult> CrearMedicamento(MedicamentoRequestDTO request)
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


            if(!await _medicamentoRepository.CrearMedicamento(request))
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se pudo registrar correctamente el medicamento!", Result = "" });

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }


        [Authorize]
        [HttpGet("obtenerMedicamentos")]
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

            List<Medicacion> medicamentos = await _medicamentoRepository.ObtenerTodos();

            if(medicamentos.Count == 0)
                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al buscar los medicamentos", Result = "" });


            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = medicamentos });
        }

        [Authorize]
        [HttpPost("obtenerpostoperatorio")]
        public async Task<IActionResult> ObtenerPostOperatorio([FromBody] int idHorario)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.vecino.ToString()]);
            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            List<MedicacionPostOperatorioResponse> medicamentosPost = await _medicamentoxhorarioRepository.ObtenerPostOperatorio(HttpContext, idHorario );

            if (medicamentosPost.Count == 0) return NotFound();

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = medicamentosPost });

        }
    }
}
