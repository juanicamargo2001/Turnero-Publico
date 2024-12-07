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
using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore.Query.Internal;
using SistemaTurneroCastracion.BLL;

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
                if (textoParseado.IndexOf("cordoba", StringComparison.OrdinalIgnoreCase) >= 0)
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

            if (!dniRepetido.Any())
            {

                int? creadoUsuario = await _usuarioRepository.crearUsuario(request.Nombre, request.Apellido, request.Contraseña,
                                                                           request.Email,
                                                                           RolesEnum.vecino.ToString());

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


        public VecinoDTO? ConsultarVecinoXDniOPerfil(long? dni, HttpContext context)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            using (var ctx = _dbContext)
            {
                var query = from v in ctx.Vecinos
                            join u in ctx.Usuarios on v.Id_usuario equals u.IdUsuario
                            join r in ctx.Roles on u.RolId equals r.IdRol
                            join m in ctx.Mascotas on v.Id_vecino equals m.IdVecino into mascotasGroup
                            from m in mascotasGroup.DefaultIfEmpty()
                            join s in ctx.Sexos on m.IdSexo equals s.IdSexos into sexoGroup
                            from s in sexoGroup.DefaultIfEmpty()
                            join t in ctx.Tamaños on m.IdTamaño equals t.IdTamaño into tipoGroup
                            from t in tipoGroup.DefaultIfEmpty()
                            join ta in ctx.TiposAnimals on m.IdTipoAnimal equals ta.IdTipo into tiposAnimalsGroup
                            from ta in tiposAnimalsGroup.DefaultIfEmpty()
                            where (r.Nombre == RolesEnum.vecino.ToString() && v.Id_usuario == idUsuario) ||
                                  (v.Dni == dni)
                            group new { m, s, t, ta } by new { u.Nombre, u.Apellido, v.Id_vecino, v.F_nacimiento,
                                v.Domicilio, v.Dni, v.Telefono, u.Email, u.IdUsuario } into vecinoGroup
                            select new VecinoDTO
                            {
                                IdUsuario = vecinoGroup.Key.IdUsuario,
                                Nombre = vecinoGroup.Key.Nombre,
                                Apellido = vecinoGroup.Key.Apellido,
                                F_nacimiento = vecinoGroup.Key.F_nacimiento,
                                Domicilio = vecinoGroup.Key.Domicilio ?? String.Empty,
                                Dni = vecinoGroup.Key.Dni,
                                Telefono = vecinoGroup.Key.Telefono,
                                Email = vecinoGroup.Key.Email,
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

        public async Task<bool> CrearVecinoTelefonico(UsuarioTelefonicoDTO request)
        {

            var dniRepetido = await this.Consultar(v => v.Dni == request.DNI);

            if (!dniRepetido.Any())
            {

                int? creadoUsuario = await _usuarioRepository.crearUsuario(request.Nombre, request.Apellido, String.Empty,
                                                                           request.Email,
                                                                           RolesEnum.vecino.ToString());

                if (creadoUsuario > 0)
                {
                    Vecino vecinoCreado = await this.Crear(new Vecino
                    {
                        F_nacimiento = request.F_Nacimiento,
                        Dni = request.DNI,
                        Domicilio = String.Empty, //cambiar cuando haya domicilio!
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

        public async Task<bool> EditarVecino(VecinoUsuarioEditarDTO request, HttpContext context)
        {

            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            if (!await EditarVecinoPorRequest(idUsuario, request))
                return false;

            if (!await _usuarioRepository.EditarUsuarioVecino(idUsuario, request))
                return false;

            return true;

        }


        private async Task<bool> EditarVecinoPorRequest(int? idUsuario, VecinoUsuarioEditarDTO request)
        {
            bool editado = false;

            Vecino? vecinoEditar = await Obtener(v => v.Id_usuario == idUsuario);

            if (vecinoEditar == null)
                return false;

            if (request.Telefono.HasValue && request.Telefono > 0)
            {
                vecinoEditar.Telefono = (long) request.Telefono;

                editado = true;

            }

            if (request.Domicilio != String.Empty)
            {
                vecinoEditar.Domicilio = request.Domicilio;

                editado = true;

            }

            if (editado)
                return await Editar(vecinoEditar);            
            

            return true;

        }

    }
}
