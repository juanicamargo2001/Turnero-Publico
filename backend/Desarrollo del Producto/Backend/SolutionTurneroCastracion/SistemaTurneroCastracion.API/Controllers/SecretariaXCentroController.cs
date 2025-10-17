using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SecretariaXCentroController : ControllerBase
    {
        private readonly ISecretariaXCentroRepository _secretariaXCentroRepository;
        private readonly Validaciones _validaciones;

        public SecretariaXCentroController(ISecretariaXCentroRepository secretariaXCentroRepository, Validaciones validaciones)
        {
            _secretariaXCentroRepository = secretariaXCentroRepository;
            _validaciones = validaciones;

        }


        [HttpPost("crearSecretaria")]
        public async Task<IActionResult> CrearUsuarioSecretaria([FromBody] SecretariaUsuarioDTO secretariaUsuario)
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

            bool secretariaCreada = await _secretariaXCentroRepository.CrearSecretariaxCentro(secretariaUsuario);


            if (!secretariaCreada)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crear la/el Secretaria/o!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }



    }
}
