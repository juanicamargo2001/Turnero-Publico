using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using SistemaTurneroCastracion.BLL;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

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

        public async Task<bool> AnalizarDNIConReglas(IFormFile image)
        {

            int dni = Int32.Parse(image.FileName.Split(".")[0]);
            var client = new HttpClient();
            string ocrUrl = "http://192.168.1.149:5000/procesar-imagen";

            using (var content = new MultipartFormDataContent())
            {
                var streamContent = new StreamContent(image.OpenReadStream());
                streamContent.Headers.ContentType = new MediaTypeHeaderValue("image/jpeg");

                // Agregar el archivo al contenido de la solicitud
                content.Add(streamContent, "file", image.FileName);

                // Enviar la solicitud POST a la API de Python
                var response = await client.PostAsync(ocrUrl, content);

                // Obtener la imagen procesada (en formato binario)
                var processedImageString = await response.Content.ReadAsStringAsync();

                bool esCordoba = esDeCordoba(processedImageString, Int32.Parse(image.FileName.Split(".")[0]));

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

        public bool esDeCordoba(string input, int dni)
        {
            string pattern = @"IDARG(\d+)<";

            Match match = Regex.Match(input, pattern);
            if (match.Success && input.IndexOf("cordoba", StringComparison.OrdinalIgnoreCase) >= 0
                && input.IndexOf("capital", StringComparison.OrdinalIgnoreCase) >= 0
                && match.Groups[1].Value == dni.ToString()
                && input.IndexOf("ARG", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                return true;
            }
            else
            {
                return false;
            }

        }


        public async Task<bool> RegistrarSinFoto(ImagenRequest request)
        {
            var dniRepetido = await this.Consultar(v => v.Dni == request.DNI);

            Usuario? emailRepetido = await _dbContext.Usuarios.Where(u => u.Email == request.Email).FirstOrDefaultAsync();

            if (!dniRepetido.Any() && emailRepetido is null)
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
