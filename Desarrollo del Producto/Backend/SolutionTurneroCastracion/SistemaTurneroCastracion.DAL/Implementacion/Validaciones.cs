using Microsoft.AspNetCore.Http;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class Validaciones
    {
        private readonly IUsuarioRepository _usuarioRepository;


        public Validaciones (IUsuarioRepository usuarioRepository)
        {
            _usuarioRepository = usuarioRepository;
        }

        public async Task<(bool IsValid, Usuario User, string ErrorMessage)> ValidateTokenAndRole(HttpContext httpContext, string[] requiredRolesNames)
        {
            var identity = httpContext.User.Identity as ClaimsIdentity;

            ValidacionResultadosDTO rToken = await Jwt.validarToken(identity, _usuarioRepository);

            if (!rToken.Success)
            {
                return (false, null, rToken.Message)!;
            }

            Usuario usuario = (Usuario)rToken.Result;

            string nombreRol = await _usuarioRepository.ObtenerRolNombre(usuario.RolId);

            if (!requiredRolesNames.Contains(nombreRol))
            {
                return (false, null, "Unauthorized")!;
            }

            return (true, usuario, null);
        }
    }
}
