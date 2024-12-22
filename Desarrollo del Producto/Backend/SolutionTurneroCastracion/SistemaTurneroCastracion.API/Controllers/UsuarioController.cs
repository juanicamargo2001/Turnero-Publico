using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RabbitMQ.Client;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using System.IdentityModel.Tokens.Jwt;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly Validaciones _validaciones;


        public UsuarioController(IUsuarioRepository usuarioRepository, Validaciones validaciones)
        {
            _usuarioRepository = usuarioRepository;
            _validaciones = validaciones;
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

        [Authorize]
        [HttpGet("rol")]
        public async Task<IActionResult> BuscarRolXUsuario()
        {
            try
            {
                string? rolNombre = await _usuarioRepository.ObtenerRol(HttpContext);

                if (rolNombre == string.Empty)
                {
                    return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error con el token!", Result = "" });

                }
                return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = rolNombre });
            }
            catch
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error con el token!", Result = "" });
            }
        }


        [Authorize]
        [HttpGet("NombreUsuario")]
        public async Task<IActionResult> ObtenerNombreUsuario()
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

            NombreApellidoDTO? nombreApellido = await _usuarioRepository.ObtenerNombreUsuario(HttpContext);

            if (nombreApellido == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al consultar el nombre!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = nombreApellido });

        }

        [Authorize]
        [HttpPut("cambiarContraseña")]
        public async Task<IActionResult> CambiarContraseña([FromBody] CambioContraseñaDTO request)
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

            if(!await _usuarioRepository.CambiarContraseña(request, HttpContext))
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al cambiar la contraseña!", Result = "" });

            return NoContent();
        }


        [HttpPut("recuperarContraseña")]
        public async Task<IActionResult> RecuperarContraseña([FromBody] EmailRequestDTO request)
        {
            if (!await _usuarioRepository.RecuperarContraseña(request))
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al recuperar la contraseña!", Result = "" });

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "Se envió correctamente el correo" });
        }


        [HttpPost("crearAdmin")]
        public async Task<IActionResult> CrearUsuarioAdmin([FromBody] RequestUsuarioAdminSuperAdmin request)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.superAdministrador.ToString()]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            int? adminCreado = await _usuarioRepository.crearUsuario(request.Nombre, request.Apellido, request.Contraseña, request.Email, RolesEnum.administrador.ToString());


            if (!(adminCreado.HasValue && adminCreado > 0))
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crear la/el Admin!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

        [HttpPost("crearSuperAdmin")]
        public async Task<IActionResult> CrearUsuarioSuperAdmin([FromBody] RequestUsuarioAdminSuperAdmin request)
        {
            var (isValid, user, errorMessage) = await _validaciones.ValidateTokenAndRole(HttpContext, [RolesEnum.superAdministrador.ToString()]);

            if (!isValid)
            {
                if (errorMessage == "Unauthorized")
                {
                    return Unauthorized();
                }
                return BadRequest(errorMessage);
            }

            int? adminCreado = await _usuarioRepository.crearUsuario(request.Nombre, request.Apellido, request.Contraseña, request.Email, RolesEnum.superAdministrador.ToString());


            if (!(adminCreado.HasValue && adminCreado > 0))
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "Sucedio un error al crear la/el superAdmin!", Result = "" });
            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = "" });
        }

    }
}
