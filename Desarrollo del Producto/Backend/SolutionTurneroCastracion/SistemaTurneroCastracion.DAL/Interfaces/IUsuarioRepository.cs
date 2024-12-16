using Microsoft.AspNetCore.Http;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IUsuarioRepository : IGenericRepository<Usuario> 
    {
        Task<int?> crearUsuario(string nombre, string apellido, string contraseña, string email, string rol);
        Task<ValidacionResultadosDTO> DevolverToken(InicioSesion autorizacion);
        Task<ValidacionResultadosDTO> DevolverRefreshToken(RefreshTokenRequestDTO refreshTokenRequest, int idUsuario);
        Task<string> ObtenerRolNombre(int? idRol);
        Task<string> ObtenerRol(HttpContext httpContext);
        Task<NombreApellidoDTO?> ObtenerNombreUsuario(HttpContext httpContext);
        Task<bool> EditarUsuarioVecino(int? idUsuario, VecinoUsuarioEditarDTO request);
        Task<bool> CambiarContraseña(CambioContraseñaDTO request, HttpContext context);
        Task<bool> RecuperarContraseña(EmailRequestDTO email);
    }
}
