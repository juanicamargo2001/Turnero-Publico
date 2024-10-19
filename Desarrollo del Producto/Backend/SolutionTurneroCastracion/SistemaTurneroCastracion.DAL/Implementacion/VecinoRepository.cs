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

        public async Task<bool> analizarDNIConReglas(string imageBytes)
        {

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

                if (!string.IsNullOrEmpty(parsedText))
                {
                    Console.WriteLine(parsedText);

                    if (parsedText.IndexOf("cordoba", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        Console.WriteLine("Se encontró la palabra 'Córdoba' en el texto.");
                    }
                    else
                    {
                        Console.WriteLine("No se encontró la palabra 'Córdoba' en el texto.");
                    }
                }
                else
                {
                    Console.WriteLine("No se detectó ningún texto en la imagen.");
                }

            return true;

            }

           
        }
    }
}
