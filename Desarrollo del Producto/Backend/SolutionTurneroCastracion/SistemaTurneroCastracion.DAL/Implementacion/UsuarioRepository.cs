using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaTurneroCastracion.BLL;
using SistemaTurneroCastracion.BLL.Interfaces;
using SistemaTurneroCastracion.BLL.Seguridad;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
    {

        protected readonly CentroCastracionContext _dbContext;
        private readonly IConfiguration _configuration;
        private readonly IAutorizacionService _autorizacionService;

        public UsuarioRepository(CentroCastracionContext dbContext, IConfiguration configuration, IAutorizacionService autorizacionService) : base(dbContext)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _autorizacionService = autorizacionService;
        }

        public async Task<int?> crearUsuario(string nombre, string apellido, string contraseña, string email, string rol)
        {
            string? convertirContraseña = null;

            if (contraseña != String.Empty)
            {
                convertirContraseña = UtilidadesUsuario.EncriptarClave(contraseña);
            }

            int numeroId = (_dbContext.Roles.Where(e => e.Nombre == rol).FirstOrDefault()!).IdRol;

            Usuario usuarioCreado = await this.Crear(new Usuario { Nombre = nombre, Apellido = apellido, Contraseña = convertirContraseña, RolId = numeroId, Email = email });

            if (usuarioCreado == null) {
                return 0;
            }
            return usuarioCreado.IdUsuario;


        }

        public async Task<Usuario?> GetUsuarios(string email, string clave)
        {

            return await _dbContext.Usuarios.Where(u => u.Email == email && 
                                                        u.Contraseña == clave).FirstOrDefaultAsync();
        }

        private async Task<ValidacionResultadosDTO> GuardarHistorialRefreshToken(
            int idUsuario,
            string token,
            string refreshToken
            )
        {

            var historialRefreshToken = new HistorialRefreshToken
            {
                IdUsuario = idUsuario,
                Token = token,
                RefreshToken = refreshToken,
                FechaCreacion = DateTime.UtcNow,
                FechaExpiracion = DateTime.UtcNow.AddDays(1)
            };


            await _dbContext.HistorialRefreshTokens.AddAsync(historialRefreshToken);
            await _dbContext.SaveChangesAsync();

            return new ValidacionResultadosDTO { Result = new { Token = token, RefreshToken = refreshToken }, Success = true, Message = "Ok" };

        }

        private string GenerarToken(Usuario usuario_encontrado)
        {
            var jwt = _configuration.GetSection("Jwt").Get<Jwt>();


            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, jwt.Subject),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString()),
            new Claim("id", usuario_encontrado.IdUsuario.ToString()),
            new Claim("nombre", usuario_encontrado.Nombre),
            new Claim("rol", usuario_encontrado.RolId.ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(30),
                SigningCredentials = credentials,
                Issuer = jwt.Issuer,
                Audience = jwt.Audience
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateEncodedJwt(tokenDescriptor);

            return token;
        }

        public async Task<ValidacionResultadosDTO> DevolverToken(InicioSesion body)
        {
            Usuario? usuario_encontrado = await this.GetUsuarios(body.email, UtilidadesUsuario.EncriptarClave(body.clave));

            if (usuario_encontrado == null)
            {
                return await Task.FromResult<ValidacionResultadosDTO>(null);
            }

            string tokenCreado = GenerarToken(usuario_encontrado);


            string refreshTokenCreado = _autorizacionService.GenerarRefreshToken();

            return await GuardarHistorialRefreshToken(usuario_encontrado.IdUsuario, tokenCreado, refreshTokenCreado);

        }

        public async Task<ValidacionResultadosDTO> DevolverRefreshToken(RefreshTokenRequestDTO refreshTokenRequest, int idUsuario)
        {
            var refreshTokenEncontrado = _dbContext.HistorialRefreshTokens.FirstOrDefault(x =>
            x.Token == refreshTokenRequest.TokenExpirado &&
            x.RefreshToken == refreshTokenRequest.RefreshToken &&
            x.IdUsuario == idUsuario);

            Usuario usuario_encontrado = await this.ObtenerPorId(idUsuario);

            if (refreshTokenEncontrado == null)
                return new ValidacionResultadosDTO { Success = false, Message = "No existe refreshToken", Result = "" };



            var refreshTokenCreado = _autorizacionService.GenerarRefreshToken();
            var tokenCreado = GenerarToken(usuario_encontrado);

            return await GuardarHistorialRefreshToken(idUsuario, tokenCreado, refreshTokenCreado);
        }

        public async Task<string> ObtenerRolNombre(int? idRol)
        {
            var resultado = await (from U in _dbContext.Usuarios
                                   join R in _dbContext.Roles on U.RolId equals R.IdRol
                                   where R.IdRol == idRol
                                   select R.Nombre).FirstOrDefaultAsync();

            return resultado!;

        }


        public async Task<string> ObtenerRol(HttpContext httpContext)
        {
            var identity = httpContext.User.Identity as ClaimsIdentity;

            var idClaim = identity.Claims.FirstOrDefault(x => x.Type == "id");

            int id = Int32.Parse(idClaim.Value);

            Usuario usuario = await this.Obtener(e => e.IdUsuario == id);

            string nombre = await this.ObtenerRolNombre(usuario.RolId);

            return nombre ?? string.Empty;
        }

        public async Task<NombreApellidoDTO?> ObtenerNombreUsuario(HttpContext httpContext)
        {
            var identity = httpContext.User.Identity as ClaimsIdentity;

            var idClaim = identity.Claims.FirstOrDefault(x => x.Type == "id");

            int id = Int32.Parse(idClaim.Value);

            NombreApellidoDTO? nombreApellidoUsuario = await (from U in _dbContext.Usuarios
                                                             where U.IdUsuario == id
                                                             select new NombreApellidoDTO
                                                             {
                                                                 Nombre = U.Nombre,
                                                                 Apellido = U.Apellido,
                                                             }).FirstOrDefaultAsync();

            return nombreApellidoUsuario;
            

        }
    }
}
