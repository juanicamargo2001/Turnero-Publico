using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using System.IdentityModel.Tokens.Jwt;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;

        public UsuarioController (IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }


        [HttpPost("IniciarSesion")]
        public async Task<IActionResult> IniciarSesion([FromBody] InicioSesion body)
        {
            try
            {
                var resultado_Autorizacion = await _usuarioRepository.DevolverToken(body);

                if (resultado_Autorizacion == null)
                    return Unauthorized();

                return Ok(resultado_Autorizacion);
            }
            catch (Exception ex)
            {
                return BadRequest("Sucedio un error inesperado!");
            }
        }


        [HttpPost]
        [Route("ObtenerRefreshToken")]
        public async Task<IActionResult> ObtenerRefreshToken([FromBody] RefreshTokenRequestDTO request)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var tokenExpiradoSupuestamente = tokenHandler.ReadJwtToken(request.TokenExpirado);

                if (tokenExpiradoSupuestamente.ValidTo > DateTime.UtcNow)
                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Token no ha expirado", Result = "" });



                string idUsuario = tokenExpiradoSupuestamente.Claims.First(x => x.Type == "id").Value.ToString();


                var autorizacionResponse = await _usuarioRepository.DevolverRefreshToken(request, int.Parse(idUsuario));

                if (autorizacionResponse.Success)
                    return Ok(autorizacionResponse);
                else
                    return BadRequest(autorizacionResponse);
            }
            catch (Exception ex)
            {
                return BadRequest("Sucedio un error inesperado!");
            }
        }
    }
}
