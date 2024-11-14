using Microsoft.Extensions.Hosting;
using RabbitMQ.Client.Events;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;

namespace SistemaTurneroCastracion.DAL.Consumer
{
    public class EmailConsumer
    {
        private const string ExchangeName = "email_exchange";
        private const string QueueName = "email_queue";
        private const string RoutingKey = "email_send";
        private readonly IConfiguration _configuration;

        public EmailConsumer(IConfiguration configuration)
        {
            _configuration = configuration;
        }   

        public async Task StartConsumingAsync()
        {
            var factory = new ConnectionFactory { HostName = "192.168.1.149", Port = 5676 };

            
            var connection = await factory.CreateConnectionAsync();
            var channel = await connection.CreateChannelAsync();

            await channel.ExchangeDeclareAsync(exchange: ExchangeName, type: ExchangeType.Direct);

            var queueDeclareResult = await channel.QueueDeclareAsync(queue: QueueName, durable: true, exclusive: false, autoDelete: false);
            var queueName = QueueName;
            await channel.QueueBindAsync(queue: queueName, exchange: ExchangeName, routingKey: RoutingKey);

            var consumer = new AsyncEventingBasicConsumer(channel);
            consumer.ReceivedAsync += async (model, ea) =>
            {
                var body = ea.Body.ToArray();
                var message = Encoding.UTF8.GetString(body);
                await EnviarCorreo(message);
            };

            await channel.BasicConsumeAsync(queue: queueName, autoAck: true, consumer: consumer);
        }

        public async Task EnviarCorreo(string message)
        {
            var lines = message.Split(new[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries)
                               .Where(line => line.Contains("@"))
                               .ToList();

            string destino = lines.FirstOrDefault() ?? "";

            string cuerpo = message.Substring(message.IndexOf("<!DOCTYPE html>"));

            string _apiUrl = _configuration["SMTPEmail:URL_API"];

            try
            {
                using (var client = new HttpClient())
                {
                    var emailData = new
                    {
                        authuser = _configuration["SMTPEmail:AuthUser"],
                        authpass = _configuration["SMTPEmail:Authpass"],
                        from = _configuration["SMTPEmail:AuthUser"],
                        to = destino,
                        subject = "Información Turno",
                        cc = "",
                        bcc = "",
                        content = "",
                        html_content = cuerpo
                    };

                    var json = JsonConvert.SerializeObject(emailData);

                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await client.PostAsync(_apiUrl, content);

                    if (response.IsSuccessStatusCode)
                    {
                        
                    }
                    else
                    {
                        Console.WriteLine($"Error al enviar el correo: {response.StatusCode} - {await response.Content.ReadAsStringAsync()}");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo electrónico: {ex.Message}");
            }

        }
    }
}
