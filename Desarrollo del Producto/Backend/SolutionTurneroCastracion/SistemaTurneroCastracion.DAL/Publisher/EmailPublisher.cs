using Microsoft.EntityFrameworkCore.Metadata;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace SistemaTurneroCastracion.DAL.Publisher
{
    public class EmailPublisher
    {
        private const string ExchangeName = "email_exchange";
        private const string RoutingKey = "email_send";

        public EmailPublisher()
        {
            
        }

        public async Task<bool> ConexionConRMQ(string mensaje, string routingKey)
        {
            try
            {
                var factory = new ConnectionFactory { HostName = "192.168.1.149", Port = 5676 };
                using var connection = await factory.CreateConnectionAsync();
                using var channel = await connection.CreateChannelAsync();

                await channel.ExchangeDeclareAsync(exchange: ExchangeName, type: ExchangeType.Direct);

                var body = Encoding.UTF8.GetBytes(mensaje);
                await channel.BasicPublishAsync(exchange: ExchangeName, routingKey: RoutingKey, body: body);

                return true;
            }
            catch {  return false; }


        }

       


    }
}
