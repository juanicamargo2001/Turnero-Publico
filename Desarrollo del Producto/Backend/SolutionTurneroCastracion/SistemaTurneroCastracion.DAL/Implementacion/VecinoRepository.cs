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

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class VecinoRepository : GenericRepository<Vecino>, IVecinoRepository
    {
        private readonly IConfiguration _configuration;
        protected readonly CentroCastracionContext _dbContext;


        public VecinoRepository(CentroCastracionContext dbContext, IConfiguration configuration) : base(dbContext)
        {
            _dbContext = dbContext;
            _configuration = configuration;

        }

        public async Task<string> AnalizarDNIConReglas(string imageBytes)
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


                string pattern = @"DOMICILIO:\s*(.*\d{1,5}.*)";

                // Realizar la búsqueda en el input
                Match match = Regex.Match(parsedText, pattern);

                if (match.Success)
                {
                    direccion = match.Groups[1].Value;
                }
                else
                {
                    direccion = null;
                }

                if (esCordoba) {   
                    //implementar logica de pagos
                }
                else
                {
                    //implementar logica de pagos
                }

                return direccion;

            }


        }

        public bool esDeCordoba(string textoParseado)
        {
            if (!string.IsNullOrEmpty(textoParseado))
            {
                Console.WriteLine(textoParseado);

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

            if (!dniRepetido.Any() && DniValido(request.DNI)) {
                Vecino vecinoCreado = await this.Crear(new Vecino
                {
                    F_nacimiento = request.F_Nacimiento,
                    Domicilio = request.Domicilio,
                    Dni = request.DNI,
                    Email = request.Email,
                    Telefono = request.Telefono,
                    Id_usuario = request.Id_Usuario
                });

                if (vecinoCreado != null) { 
                
                    return true;
                }
                return false;
            
            }
            return false;
        }

        public bool DniValido(long dni)
        {
            string pattern = @"^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$";
            Regex regex = new (pattern);

            if (regex.IsMatch(dni.ToString()))
            {
                return true;
            }
            else
            {
                return false; 
            }
        }
    }

   
}
