using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;
using Azure.Core;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using SistemaTurneroCastracion.Entity.Dtos;
using System.Runtime.CompilerServices;
using Microsoft.Identity.Client;
using Microsoft.EntityFrameworkCore;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class VecinoRepository : GenericRepository<Vecino>, IVecinoRepository
    {
        private readonly IConfiguration _configuration;
        protected readonly CentroCastracionContext _dbContext;
        private readonly IUsuarioRepository _usuarioRepository;


        public VecinoRepository(CentroCastracionContext dbContext, IConfiguration configuration, IUsuarioRepository usuarioRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _configuration = configuration;
            _usuarioRepository = usuarioRepository;

        }

        public async Task<bool> AnalizarDNIConReglas(string imageBytes)
        {
            string? direccion;
            string apiKey = _configuration["OCRService:ApiKey"];
            string base64Image = imageBytes;
            string ocrUrl = "https://api.ocr.space/parse/image";

            using (HttpClient client = new HttpClient())
            {
                var requestContent = new MultipartFormDataContent();
                requestContent.Add(new StringContent(apiKey), "apikey");
                requestContent.Add(new StringContent(base64Image), "base64Image");
                requestContent.Add(new StringContent("spa"), "language");

                HttpResponseMessage response = await client.PostAsync(ocrUrl, requestContent);
                string responseString = await response.Content.ReadAsStringAsync();

                var jsonResponse = JObject.Parse(responseString);

                string parsedText = jsonResponse["ParsedResults"]?[0]?["ParsedText"]?.ToString();


                bool esCordoba = esDeCordoba(parsedText);

                if (esCordoba)
                {
                    return true;
                }
                else
                {
                    return false;
                }

            }


        }

        public bool esDeCordoba(string textoParseado)
        {
            if (!string.IsNullOrEmpty(textoParseado))
            {
                if (textoParseado.IndexOf("cordoba", StringComparison.OrdinalIgnoreCase) >= 0 && textoParseado.IndexOf("capital", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }


        public async Task<bool> RegistrarSinFoto(ImagenRequest request)
        {
            var dniRepetido = await this.Consultar(v => v.Dni == request.DNI);

            if (!dniRepetido.Any() && DniValido(request.DNI))
            {

                int? creadoUsuario = await _usuarioRepository.crearCuentaVecino(request.Nombre, request.Apellido, request.Contraseña, request.Email);

                if (creadoUsuario > 0)
                {
                    Vecino vecinoCreado = await this.Crear(new Vecino
                    {
                        F_nacimiento = request.F_Nacimiento,
                        Domicilio = request.Domicilio,
                        Dni = request.DNI,
                        Telefono = request.Telefono,
                        Id_usuario = creadoUsuario
                    });

                    if (vecinoCreado != null)
                    {
                        return true;
                    }
                }

                return false;

            }
            return false;
        }

        public bool DniValido(long dni)
        {
            string pattern = @"^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$";
            Regex regex = new(pattern);

            if (regex.IsMatch(dni.ToString()))
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        public VecinoDTO? ConsultarVecino(long dniVecino)
        {
            using (var ctx = _dbContext)
            {
                var query = from v in ctx.Vecinos
                            join m in ctx.Mascotas on v.Id_vecino equals m.IdVecino into mascotasGroup
                            from m in mascotasGroup.DefaultIfEmpty()
                            join s in ctx.Sexos on m.IdSexo equals s.IdSexos into sexoGroup
                            from s in sexoGroup.DefaultIfEmpty()
                            join t in ctx.Tamaños on m.IdTamaño equals t.IdTamaño into tipoGroup
                            from t in tipoGroup.DefaultIfEmpty()
                            join ta in ctx.TiposAnimals on m.IdTipoAnimal equals ta.IdTipo into tiposAnimalsGroup
                            from ta in tiposAnimalsGroup.DefaultIfEmpty()
                            where v.Dni == dniVecino
                            group new { m, s, t, ta } by new { v.Id_vecino, v.F_nacimiento, v.Domicilio, v.Dni, v.Telefono } into vecinoGroup
                            select new VecinoDTO
                            {
                                F_nacimiento = vecinoGroup.Key.F_nacimiento,
                                Domicilio = vecinoGroup.Key.Domicilio,
                                Dni = vecinoGroup.Key.Dni,
                                Telefono = vecinoGroup.Key.Telefono,
                                Mascotas = vecinoGroup
                                .Where(g => g.m != null)
                                .Select(g => new MascotaDTO
                                {
                                    idMascota = g.m.IdMascota,
                                    Edad = g.m.Edad,
                                    Descripcion = g.m.Descripcion,
                                    Nombre = g.m.Nombre,
                                    Sexo = g.s.SexoTipo,
                                    Tamaño = g.t.TamañoTipo,
                                    TipoAnimal = g.ta.TipoAnimal,
                                    Vecino = g.m.IdVecino
                                }).ToList()
                            };

                return query.FirstOrDefault();

                

            }


        }

    }
}
