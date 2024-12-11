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

        public MedicamentoController(IMedicamentoRepository medicamentoRepository, Validaciones validaciones)
        {
            _medicamentoRepository = medicamentoRepository;
            _validaciones = validaciones;
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

    }
}
