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
    public class Jwt
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string Subject { get; set; }



        public async static Task<ValidacionResultadosDTO> validarToken(ClaimsIdentity identity, IUsuarioRepository _usuarioRepository)
        {
            try
            {
                if (identity == null)
                {
                    return new ValidacionResultadosDTO
                    {
                        Success = false,
                        Message = "Identity is null",
                        Result = ""
                    };
                }

                if (!identity.IsAuthenticated)
                {
                    return new ValidacionResultadosDTO
                    {
                        Success = false,
                        Message = "Verificar Token",
                        Result = ""
                    };
                }

                if (!identity.Claims.Any())
                {
                    return new ValidacionResultadosDTO
                    {
                        Success = false,
                        Message = "No claims found in token",
                        Result = ""
                    };
                }

                var idClaim = identity.Claims.FirstOrDefault(x => x.Type == "id");
                if (idClaim == null || string.IsNullOrEmpty(idClaim.Value))
                {
                    return new ValidacionResultadosDTO
                    {
                        Success = false,
                        Message = "ID del token no encontrado",
                        Result = ""
                    };
                }

                string id = idClaim.Value;

                Usuario usuario = await _usuarioRepository.ObtenerPorId(Int32.Parse(id));

                if (usuario == null)
                {
                    return new ValidacionResultadosDTO
                    {
                        Success = false,
                        Message = "Usuario no encontrado",
                        Result = ""
                    };
                }


                return new ValidacionResultadosDTO
                {
                    Success = true,
                    Message = "Exito",
                    Result = usuario
                };


            }
            catch (Exception ex)
            {
                return new ValidacionResultadosDTO
                {
                    Success = false,
                    Message = "Catch: " + ex.Message,
                    Result = ""
                };
            }

        }
    }
}
