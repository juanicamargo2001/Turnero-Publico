using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.BLL
{
    public class UtilidadesUsuario
    {
        public static string EncriptarClave(string clave)
        {

            StringBuilder sb = new StringBuilder();

            using (SHA256 hash = SHA256.Create())
            {
                Encoding enc = Encoding.UTF8;

                byte[] result = hash.ComputeHash(enc.GetBytes(clave));

                foreach (byte b in result)
                    sb.Append(b.ToString("x2"));
            }

            return sb.ToString();

        }


        public static int? ObtenerIdUsuario(HttpContext context)
        {
            ClaimsIdentity? identidad = context.User.Identity as ClaimsIdentity;

            Claim? idUsuarioClam = identidad?.Claims.FirstOrDefault(x => x.Type == "id");

            int? idUsuario = Int32.Parse(idUsuarioClam.Value);


            return idUsuario;
        }

    }
}
