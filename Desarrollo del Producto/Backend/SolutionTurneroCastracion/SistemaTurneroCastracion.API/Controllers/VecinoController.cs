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
        public async Task<IActionResult> ProcesarImagen([FromForm] IFormFile image)
        {
            if (image != null || image.Length != 0)
            {
                bool textoExtraido = await _vecinoRepository.AnalizarDNIConReglas(image);

                if (!textoExtraido) {
                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "El vecino no es de Córdoba, si lo es, intente de nuevo!", Result = "" });
                }

                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });

            }
            return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al procesar la imagen!", Result = "" });

        }

        // ver como hacer para que los usuarios no puedan ver datos que no le pertenecen cuando realiza la consulta con su DNI, para que no pueda acceder a otros DNIs
        [Authorize]
        [HttpGet("perfilPorUsuario")]
        public async Task<IActionResult> ConsultarPerfilVecino()
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


            VecinoDTO? vecinoConsulta = _vecinoRepository.ConsultarVecinoXDniOPerfil(null, HttpContext);


            if (vecinoConsulta == null) {

                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });

            }
            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = vecinoConsulta });
        }


        [Authorize]
        [HttpGet("dni")]
        public async Task<IActionResult> ConsultarVecinoPorDNI(long dni)
        {

            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "administrador", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            VecinoDTO? vecinoDNI = _vecinoRepository.ConsultarVecinoXDniOPerfil(dni, HttpContext);


            if (vecinoDNI == null)
            {

                return NotFound(new ValidacionResultadosDTO { Success = false, Message = "No se encontró el dni!", Result = "" });

             }
            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = vecinoDNI });


        }

        [Authorize]
        [HttpPost("vecinoMinimo")]
        public async Task<IActionResult> RegistrarVecinoTelefonico([FromBody] UsuarioTelefonicoDTO request)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["secretaria", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }


            if (request != null)
            {
                bool vecinoCreado = await _vecinoRepository.CrearVecinoTelefonico(request);

                if (!vecinoCreado)
                {

                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });
                }
                return NoContent();
            }
            return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error inesperado!", Result = "" });

        }

        [Authorize]
        [HttpPut("editarVecino")]
        public async Task<IActionResult> EditarVecino([FromBody] VecinoUsuarioEditarDTO vecinoEditarDTO)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, ["vecino", "superAdministrador"]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            if(!await _vecinoRepository.EditarVecino(vecinoEditarDTO, HttpContext))
                return BadRequest(new ValidacionResultadosDTO { Success = false, 
                                                                Message = "Sucedio un error inesperado al momento de editar el vecino!", 
                                                                Result = "" });


            return NoContent();
        }


    }
}

