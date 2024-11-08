using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SistemaTurneroCastracion.BLL.Interfaces;
using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.BLL.Seguridad
{
    public class AutorizacionService : IAutorizacionService
    {
        private readonly IConfiguration _configuration;

        public AutorizacionService(IConfiguration configuration)
        {
            _configuration = configuration;
        }   

        public string GenerarRefreshToken()
        {

            var byteArray = new byte[64];
            var refreshToken = "";

            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(byteArray);
                refreshToken = Convert.ToBase64String(byteArray);
            }
            return refreshToken;
        }

        

    }
}
