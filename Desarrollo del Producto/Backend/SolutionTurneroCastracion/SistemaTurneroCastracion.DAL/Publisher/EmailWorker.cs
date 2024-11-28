using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Publisher
{
    public class EmailWorker : IHostedService, IDisposable
    {
        private readonly IServiceScopeFactory _scopeFactory;

        private Timer _timer;

        public EmailWorker(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        { // 5 minutos = 300000
            _timer = new Timer(ExecuteTask, cancellationToken, 0, 60000);
            return Task.CompletedTask;
        }

        private async void ExecuteTask(object state)
        {
            var cancellationToken = (CancellationToken) state;


            if (cancellationToken.IsCancellationRequested)
            {
                Console.WriteLine("Tarea cancelada antes de comenzar.");
                return;
            }

            using (var scope = _scopeFactory.CreateScope())
            {
                DateTime ahora = DateTime.UtcNow;   
                var dbContext = scope.ServiceProvider.GetRequiredService<CentroCastracionContext>();
                var emailPublisher = scope.ServiceProvider.GetRequiredService<EmailPublisher>();
                var horario = scope.ServiceProvider.GetRequiredService<IHorariosRepository>();


                var correosPendientes = await dbContext.CorreosProgramados
                    .Where(c => c.Estado == EstadoCorreo.Pendiente.ToString()
                                && c.FechaEnvio.Date == ahora.AddDays(2).Date)
                    .ToListAsync();

                var correosAvisoPrevio = await (from C in dbContext.CorreosProgramados
                                                join H in dbContext.Horarios on C.IdHorario equals H.IdHorario
                                                join E in dbContext.Estados on H.Id_Estado equals E.IdEstado
                                                where E.Nombre == EstadoTurno.Confirmado.ToString()
                                                      && C.Estado == EstadoCorreo.Enviado.ToString()
                                                      && C.FechaEnvio.Date == ahora.Date
                                                      && C.Hora.Hours == ahora.AddHours(-1).Hour
                                                      && C.Hora.Minutes <= ahora.Minute
                                                select C).ToListAsync();

                List<Horarios> turnosACancelar = await (from C in dbContext.CorreosProgramados
                                                        join H in dbContext.Horarios on C.IdHorario equals H.IdHorario
                                                        join E in dbContext.Estados on H.Id_Estado equals E.IdEstado
                                                        where E.Nombre == EstadoTurno.Reservado.ToString()
                                                              && C.EsActivo == false
                                                        select H).ToListAsync();


                foreach (var correo in correosPendientes)
                {
                    try
                    {
                        string mensaje = this.CambiarTexto(correo, true, "Confirmación de Turno");
                        await emailPublisher.ConexionConRMQ(mensaje, "email_send_delayed");

                        correo.Estado = EstadoCorreo.Enviado.ToString();
                        dbContext.CorreosProgramados.Update(correo);
                    }
                    catch (Exception ex)
                    {
                        correo.Estado = EstadoCorreo.Fallido.ToString();
                        dbContext.CorreosProgramados.Update(correo);
                    }
                }


                if (correosAvisoPrevio.Count > 0) {

                    foreach (var correo in correosAvisoPrevio)
                    {
                        try
                        {
                            string mensaje = this.CambiarTexto(correo, false, "Recordatorio de Turno");
                            await emailPublisher.ConexionConRMQ(mensaje, "email_send_delayed");

                            correo.Estado = EstadoCorreo.Recordado.ToString();

                        }
                        catch (Exception ex)
                        {
                            correo.Estado = EstadoCorreo.Fallido.ToString();
                            dbContext.CorreosProgramados.Update(correo);
                        }
                    }
                }


                if (turnosACancelar.Count > 0)
                {

                    foreach (var turno in turnosACancelar)
                    {
                        try
                        {
                            int estado = (from E in dbContext.Estados
                                         where E.Nombre == EstadoTurno.Cancelado.ToString()
                                         select E.IdEstado).FirstOrDefault();

                            turno.Id_Estado = estado;

                            turno.Id_Usuario = null;

                            dbContext.Horarios.Update(turno);

                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.ToString());
                        }
                    }
                }


                await dbContext.SaveChangesAsync();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }


        public string CambiarTexto(CorreosProgramados correo, bool incluirBotonConfirmar, string titulo)
        {
            string tiempoFormateado = $"{correo.Hora.Hours}:{correo.Hora.Minutes:D2} Hrs";

            string fechaFormateada = correo.FechaEnvio.ToString("dd-MM-yyyy");

            TextInfo textInfo = new CultureInfo("es-ES", false).TextInfo;

            string nombreFormateado = textInfo.ToTitleCase(correo.NombreCompleto.ToLower());

            string tipoAnimalEmoji = correo.TipoAnimal switch
            {
                "GATO" => "😺",
                "PERRO" => "🐶",
                _ => "" 
            };


            string botonConfirmar = incluirBotonConfirmar ? @"
                <tr>
                    <td style=""text-align: center; margin-bottom: 7px;"">
                        <a href=""http://centroCastracion.com"" style=""background-color: #2c7dda; color: white; padding: 10px 20px; border: none; border-radius: 5px; font-size: 16px; text-decoration: none; display: inline-block;"">
                            Confirmar
                        </a>
                    </td>
                </tr>" : string.Empty;

            string Body = $"{correo.EmailDestino}\n" + @"
                           <!DOCTYPE html>
                           <html lang=""es"">
                           <head>
                             <meta charset=""UTF-8"">
                             <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                           </head>
                           <body style=""margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;"">
                             <table align=""center"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""600"" style=""border-collapse: collapse; background-color: #ffffff;"">

                               <tr>
                                 <td align=""left"" style=""padding: 20px 0 10px 20px; background-color: #3a5475;"">
                                   <img src=""https://biocordoba.cordoba.gob.ar/wp-content/uploads/sites/14/2022/02/cropped-favicon.png"" alt=""Logo de la Empresa"" style=""width: 50px; height: auto; display: block; margin: auto;"">
                                   <p style=""margin: 17px 0 5px; color: #e6e6e6; font-size: 16px; text-align: center; font-family:Arial, Helvetica, sans-serif"">Municipio BIOCORDOBA</p>
                                 </td>
                               </tr>

                               <tr>
                                 <td style=""padding: 0 20px;"">
                                   <h2 style=""color: #0072bc; font-size: 22px; margin-top: 30px;"">" + titulo + @"</h2>
                                 </td>
                               </tr>

                               <tr>
                                 <td style=""padding: 10px 20px;"">
                                   <p style=""color: #333333; font-size: 16px; margin: 0;"">
                                     Hola, " + nombreFormateado + @". Le recordamos que tiene un turno:
                                   </p>
                                 </td>
                               </tr>
                               <!-- <tr>
                                 <td style=""padding: 10px 20px;"">
                                   <h3 style=""color: #0072bc; font-size: 18px; margin-bottom: -10px;"">Detalle de turno</h3>
                                 </td>
                               </tr> -->
                               <tr>
                                 <td style=""padding: 10px 20px;"">
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     <strong>🏥 Centro Castración: </strong> " + correo.CentroCastracion + @"
                                   </p>
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     <strong>🗓️ Fecha: </strong> " + fechaFormateada + @"
                                   </p>
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     <strong>🕑 Hora: </strong> " + tiempoFormateado + @"
                                   </p>
                                   <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                     "+ tipoAnimalEmoji + @" <strong> Tipo de Animal: </strong> " + char.ToUpper(correo.TipoAnimal[0]) + correo.TipoAnimal.Substring(1).ToLower() + @"
                                   </p>
                                 </td>
                               </tr>
                               <tr>
                                   <td style=""text-align: center; padding: 10px;"">
                                       <p style=""font-size: 14px; background-color: #FFF4E0; padding: 15px; border-radius: 10px; display: inline-block; text-align: center; max-width: 450px; width: 100%; color: #C68642; font-weight: bold;"">
                                           En caso de no poder asistir al turno programado, es importante que cancele o reprograme por medio de la 
                                           <a href=""https://www.centroCastracion.com"" style=""color: #A0522D; ""><strong>página oficial</strong></a>
                                       </p>
                                   </td>
                               </tr>
    
    
                               <tr>
                                   " + botonConfirmar + @"
                               </tr>

                               <tr>
                                 <td style=""padding: 20px;"">
                                   <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                     <tr>
                                       <td width=""25%"" style=""background-color: #e8b434; height: 4px;""></td>
                                       <td width=""25%"" style=""background-color: #e64545; height: 4px;""></td>
                                       <td width=""25%"" style=""background-color: #b855d8; height: 4px;""></td>
                                       <td width=""25%"" style=""background-color: #0072bc; height: 4px;""></td>
                                     </tr>
                                   </table>
                                 </td>
                               </tr>

                               <tr>
                                 <td style=""padding: 10px 20px; text-align: center; color: #999999; font-size: 12px;"">
                                   Este mensaje se envió de forma automática. Por favor, no responda.<br>
                                   En caso de no haber solicitado ningún turno, desestime este mail.
                                 </td>
                               </tr>
                             </table>
                           </body>
                           </html>";

            return Body;
        }

    }
}
