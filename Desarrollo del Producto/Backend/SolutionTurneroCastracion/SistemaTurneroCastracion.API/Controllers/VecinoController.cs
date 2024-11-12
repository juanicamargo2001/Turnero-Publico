using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System.Diagnostics.Eventing.Reader;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VecinoController : ControllerBase
    {

        private readonly IVecinoRepository _vecinoRepository;
        private readonly Validaciones _validaciones;


        public VecinoController(IVecinoRepository vecinoRepository, Validaciones validaciones)
        {
            _vecinoRepository = vecinoRepository;
            _validaciones = validaciones;
        }


        [HttpPost]
        public async Task<IActionResult> RegistrarVecino([FromBody] ImagenRequest request)
        {
            if (request != null)
            {
                bool vecinoCreado = await _vecinoRepository.RegistrarSinFoto(request);

                if (!vecinoCreado) {

                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });
                }
                return NoContent();
            }
            return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });

        }

        [HttpPost("procesarImagen")]
        public async Task<IActionResult> ProcesarImagen([FromBody] string imagenDorso)
        {
            if (!string.IsNullOrEmpty(imagenDorso))
            {
                bool textoExtraido = await _vecinoRepository.AnalizarDNIConReglas(imagenDorso);

                if (!textoExtraido) {
                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "El vecino no es de Córdoba, si lo es, intente de nuevo!", Result = "" });
                }

                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = textoExtraido });

            }
            return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al procesar la imagen!", Result = "" });

        }

        // ver como hacer para que los usuarios no puedan ver datos que no le pertenecen cuando realiza la consulta con su DNI, para que no pueda acceder a otros DNIs
        [Authorize]
        [HttpGet("{dni}")]
        public async Task<IActionResult> ConsultarVecino(long dni)
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


            VecinoDTO? vecinoConsulta = _vecinoRepository.ConsultarVecino(dni, HttpContext);


            if (vecinoConsulta == null) {

                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });

            }
            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = vecinoConsulta });
        }

    }
}

