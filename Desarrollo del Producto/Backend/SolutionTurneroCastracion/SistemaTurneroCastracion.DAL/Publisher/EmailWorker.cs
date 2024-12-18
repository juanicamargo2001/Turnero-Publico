using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SistemaTurneroCastracion.BLL;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography.Xml;
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
        { // 15 minutos = 900000
            _timer = new Timer(ExecuteTask, cancellationToken, 0, 300000);
            return Task.CompletedTask;
        }

        private async void ExecuteTask(object state)
        {
            CancellationToken cancellationToken = (CancellationToken)state;


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
                                                        where (E.Nombre == EstadoTurno.Reservado.ToString() && C.EsActivo == false) || 
                                                              (E.Nombre == EstadoTurno.Confirmado.ToString()
                                                              && ahora.Year == C.FechaEnvio.Year
                                                              && ahora.Day == C.FechaEnvio.Day
                                                              && ahora.AddHours(-3).Hour == C.Hora.Hours
                                                              && ahora.Minute >= C.Hora.Minutes + 15)
                                                        select H).ToListAsync();


                foreach (var correo in correosPendientes)
                {
                    try
                    {
                        string mensaje = EnvioCorreosHTML.CrearHTMLConfirmacionYRecordatorio(correo, incluirBotonConfirmar: true);
                        await emailPublisher.ConexionConRMQ(mensaje, "email_send_delayed");

                        correo.Estado = EstadoCorreo.Enviado.ToString();
                    }
                    catch (Exception ex)
                    {
                        correo.Estado = EstadoCorreo.Fallido.ToString();
                        Console.WriteLine(ex.Message);
                    }

                    await dbContext.SaveChangesAsync();
                }


                if (correosAvisoPrevio.Count > 0) {

                    foreach (var correo in correosAvisoPrevio)
                    {
                        try
                        {
                            string mensaje = EnvioCorreosHTML.CrearHTMLConfirmacionYRecordatorio(correo, incluirBotonConfirmar: false);
                            await emailPublisher.ConexionConRMQ(mensaje, "email_send_delayed");

                            correo.Estado = EstadoCorreo.Recordado.ToString();

                        }
                        catch (Exception ex)
                        {
                            correo.Estado = EstadoCorreo.Fallido.ToString();
                            Console.WriteLine(ex.Message);
                        }
                        await dbContext.SaveChangesAsync();
                    }
                }


                if (turnosACancelar.Count > 0)
                {

                    foreach (var turno in turnosACancelar)
                    {
                        try
                        {
                            int estadoCancelado = (from E in dbContext.Estados
                                         where E.Nombre == EstadoTurno.Cancelado.ToString()
                                         select E.IdEstado).FirstOrDefault();

                            turno.Id_Estado = estadoCancelado;

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

    }
}
