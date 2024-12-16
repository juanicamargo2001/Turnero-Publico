using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using SistemaTurneroCastracion.BLL;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.DAL.Publisher;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class HorariosRepository : GenericRepository<Horarios> , IHorariosRepository
    {
        protected readonly CentroCastracionContext _dbContext;
        private readonly EmailPublisher _emailPublisher;
        private readonly ICorreosProgramados _correosProgramados;
        private readonly IMascotaRepository _mascotaRepository;
        private readonly IMedicamentoxhorarioRepository _medicamentoxhorarioRepository;

        public HorariosRepository(CentroCastracionContext dbContext, ICorreosProgramados correosProgramados, 
                                  EmailPublisher emailPublisher, IMascotaRepository mascotaRepository, 
                                  IMedicamentoxhorarioRepository medicamentoxhorarioRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _emailPublisher = emailPublisher;
            _correosProgramados = correosProgramados;
            _mascotaRepository = mascotaRepository;
            _medicamentoxhorarioRepository = medicamentoxhorarioRepository;
        }


        public async Task<bool> crearHorarios(HorarioCentroParametroDTO centro)
        {

            TimeSpan? inicio = centro.InicioTrabajo;
            TimeSpan? fin = centro.FinTrabajo;
            TimeSpan? horaActual = inicio;

            var horariosGenerados = new List<Horarios>();

            int iteracion = 0;

            if (centro.HoraInicio >= inicio && centro.HoraFin <= fin)
            {
                int estadoLibre = this.BuscarEstado(EstadoTurno.Libre.ToString());

                while (iteracion < centro.Cantidad)
                {
                    horariosGenerados.Add(new Horarios
                    {
                        Hora = centro.HoraInicio,
                        IdTurno = centro.IdTurno,
                        TipoTurno = centro.IdTipoTurno,
                        Id_Estado = estadoLibre
                    });

                    iteracion++;

                    if (centro.Cantidad == iteracion)
                    {
                        break;
                    }

                }
            }
            try
            {
                _dbContext.Horarios.AddRange(horariosGenerados);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }


        public async Task<bool> EliminarHorarios(int idAgenda)
        {
            List<Horarios> horariosEliminar = await (from H in _dbContext.Horarios
                                                     join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                                     join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                                     where A.IdAgenda == idAgenda
                                                     select H).ToListAsync();

            if (horariosEliminar.Count > 0)
            {
                try
                {
                    _dbContext.RemoveRange(horariosEliminar);
                    await _dbContext.SaveChangesAsync();

                    return true;
                }
                catch
                {
                    return false;
                }
            }
            return false;

        }


        public async Task<bool> CambiarEstado (EstadoTurno estadoTurno, int id_Horario)
        {
            int id_estado = this.BuscarEstado(estadoTurno.ToString());

            Horarios horarioEncontrado = await this.Obtener(h => h.IdHorario == id_Horario);

            if (horarioEncontrado == null) 
            {
                return false;
            }

            horarioEncontrado.Id_Estado = id_estado;

            bool editado = await this.Editar(horarioEncontrado);

            if (!editado) { 
            
                return false;
            }

            return true;

        }

        

        private int BuscarEstado(string nombreEstado)
        {
            int id_estado = (from E in _dbContext.Estados
                            where E.Nombre == nombreEstado
                            select E.IdEstado)
                            .FirstOrDefault();

            return id_estado;
        }


        public async Task<bool> SacarTurno(HorarioMascotaDTO horarioMascota, HttpContext? httpContext = null, int? idUsuario = null)
        {

            idUsuario ??= httpContext != null ? UtilidadesUsuario.ObtenerIdUsuario(httpContext) : null;

            if (idUsuario == null)
                return false;

            if (await EsEstado(EstadoTurno.Cancelado, horarioMascota.IdTurnoHorario))
                return false;

            if (!await ValidarDisponibilidad(idUsuario, horarioMascota))
                return false;
             
            if (!await ValidarTipoTurnoAnimal(horarioMascota))
                return false;

            if (!await CambiarEstado(EstadoTurno.Reservado, horarioMascota.IdTurnoHorario))
                return false;

            if (!await ActualizarHorario(idUsuario, horarioMascota))
                return false;

            return await EnviarCorreoTurnoSolicitado(idUsuario, horarioMascota);

           
        }


        private async Task<bool> EnviarCorreoTurnoSolicitado(int? idUsuario, HorarioMascotaDTO horarioMascota)
        {
            EmailDTO email = await this.ObtenerInformacionEmail(idUsuario, horarioMascota.IdTurnoHorario, "Registro de Turno", "Hemos agendado correctamente su turno.");

            string mensaje = this.CambiarTexto(email, esCancelacion: false);

            await _emailPublisher.ConexionConRMQ(mensaje, "email_send");

            bool guardado = await _correosProgramados.GuardarCorreoProgramado(email, horarioMascota.IdTurnoHorario);

            if (!guardado)
            {
                return false;
            }
            return true;
        }

        private async Task<bool> ActualizarHorario(int? idUsuario, HorarioMascotaDTO horarioMascota)
        {
            Horarios? horarioEntrado = await this.Obtener(h => h.IdHorario == horarioMascota.IdTurnoHorario);

            if (horarioEntrado == null) return false;

            horarioEntrado.Id_Usuario = idUsuario;
            horarioEntrado.Id_mascota = horarioMascota.IdMascota;


            try
            {
                await this.Editar(horarioEntrado);

                return true;

            }
            catch (DbUpdateConcurrencyException ex)
            {
                foreach (var entry in ex.Entries)
                {
                    if (entry.Entity is Horarios)
                    {
                        var proposedValues = entry.CurrentValues;
                        var databaseValues = await entry.GetDatabaseValuesAsync();

                        if (databaseValues != null)
                        {
                            proposedValues.SetValues(databaseValues);
                        }
                    }
                }

                return false;
            }
        }

        private async Task<bool> ValidarTipoTurnoAnimal(HorarioMascotaDTO horarioMascota)
        {
            bool esTipoAnimalTurno = await this.EsTurnoTipoAnimal(horarioMascota);

            if (!esTipoAnimalTurno)
            {
                return false;
            }

            return true;

        }

        public async Task<bool> ValidarDisponibilidad(int? idUsuario, HorarioMascotaDTO horarioMascota)
        {
            bool turnoVecinoPresente = await this.EsTurnoPresenteEnMes(idUsuario, horarioMascota.IdTurnoHorario);

            if (turnoVecinoPresente)
            {
                return false;
            }

            bool ocupado = this.EstaOcupado(horarioMascota.IdTurnoHorario);

            if (!ocupado)
            {
                return true;
            }

            return false;

        }


        private async Task<bool> EsTurnoTipoAnimal(HorarioMascotaDTO horarioMascota)
        {
            string? tipoTurno = await (from H in _dbContext.Horarios
                                      join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                                      where H.IdHorario == horarioMascota.IdTurnoHorario
                                      select TT.NombreTipo).FirstOrDefaultAsync();

            string? tipoAnimal = await (from M in _dbContext.Mascotas
                                     join TA in _dbContext.TiposAnimals on M.IdTipoAnimal equals TA.IdTipo
                                     where M.IdMascota == horarioMascota.IdMascota
                                     select TA.TipoAnimal).FirstOrDefaultAsync();


            if (tipoTurno != null && tipoAnimal != null && tipoTurno.ToUpper() == tipoAnimal.ToUpper()) {          
                return true;
            }
            
            return false;

        }

        private async Task<bool> EsTurnoPresenteEnMes(int? idUsuario, int idTurnoHorario)
        {
            var agendaTurno = await (from H in _dbContext.Horarios
                                    join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                    join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                    where H.IdHorario == idTurnoHorario
                                    select A).FirstOrDefaultAsync();

            DateTime? fechaFin = agendaTurno!.Fecha_fin;

            return await (from H in _dbContext.Horarios
                          join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                          where H.Id_Usuario == idUsuario
                                && T.Dia.Year == fechaFin!.Value.Year
                                && T.Dia.Month == fechaFin.Value.Month
                          select H).AnyAsync();

        }

        public bool EstaOcupado(int IdTurnoHorario)
        {
            string? nombreEstado = (from E in _dbContext.Estados
                                join H in _dbContext.Horarios on E.IdEstado equals H.Id_Estado
                                where H.IdHorario == IdTurnoHorario
                                select E.Nombre)
                                .FirstOrDefault();

            if (nombreEstado != EstadoTurno.Libre.ToString())
            {
                return true;
            }

            return false;

        }

        public async Task<bool> CancelarTurno(int idTurno, HttpContext context)
        {

            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            if (!await EsEstado(EstadoTurno.Reservado, idTurno))
                return false;


            if (!await this.CambiarEstado(EstadoTurno.Libre, idTurno))
                return false;
            

            Horarios? cancelarUsuario= _dbContext.Horarios.Where(h => h.IdHorario == idTurno).FirstOrDefault();

            if (cancelarUsuario == null)
                return false;

            EmailDTO email = await this.ObtenerInformacionEmail(idUsuario, idTurno, "Cancelación de Turno", "Hemos cancelado su turno de forma exitosa.");

            cancelarUsuario.Id_Usuario = null;


            if (!await this.Editar(cancelarUsuario))
                return false;
            

            string mensaje = this.CambiarTexto(email, esCancelacion: true);

            await _emailPublisher.ConexionConRMQ(mensaje, "email_send");


            if (!await _correosProgramados.BorrarCorreo(idTurno))
                return false;
            
            return true;


        }

        

        public async Task<EmailDTO> ObtenerInformacionEmail(int? idUsuario, int IdHorario, string tipoMensaje, string mensaje)
        {
            var emailDTO = (from U in _dbContext.Usuarios
                           join H in _dbContext.Horarios on U.IdUsuario equals H.Id_Usuario
                           join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                           join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                           join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                           join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                           where H.IdHorario == IdHorario && U.IdUsuario == idUsuario
                           select new EmailDTO
                           {
                               TipoEmail = tipoMensaje,
                               Email = U.Email,
                               Nombre = U.Nombre,
                               CentroCastracion = C.Nombre,
                               Fecha = T.Dia.ToString(),
                               Hora = H.Hora.ToString(),
                               Tipo = TT.NombreTipo,
                               Mensaje = mensaje

                           }).FirstOrDefault();

            return emailDTO;
        }

        public async Task<bool> ConfirmarTurno(int idHorario, HttpContext context)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            bool esDiaActual = await this.EsDiaActual(idHorario, idUsuario);

            if (esDiaActual)
            {
                if (!await this.CambiarEstado(EstadoTurno.Confirmado, idHorario))
                    return false;
                
                return true;
            }

            return false;
        }

        private async Task<bool> EsDiaActual(int idHorario, int? id)
        {
            DateTime actual = DateTime.Now;

            var turnoHabilitadoConfirmacion = await (from H in _dbContext.Horarios
                                              join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                              join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                              where H.IdHorario == idHorario
                                                    && T.Dia.Year == actual.Year
                                                    && T.Dia.Day == actual.Day
                                                    && H.Id_Usuario == id
                                                    && E.Nombre == EstadoTurno.Reservado.ToString()
                                              select H).ToListAsync();

            if (turnoHabilitadoConfirmacion.Count > 0) {
                return true;   
            }

            return false;

        }

        public async Task<List<TurnosFiltradoSecretariaDTO?>> ObtenerHorariosFiltrados(TurnosSecretariaDTO filtro, HttpContext context)
        {

            int? idCentroXSecretaria = await this.ObtenerIdCentroXSecretaria(context);

            var turnosHorarios = await (from H in _dbContext.Horarios
                                  join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                  join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                                  join U in _dbContext.Usuarios on H.Id_Usuario equals U.IdUsuario
                                  join V in _dbContext.Vecinos on U.IdUsuario equals V.Id_usuario
                                  join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                  join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                  join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                                  where T.Dia >= filtro.FechaDesde && T.Dia <= filtro.FechaHasta
                                       && H.Hora >= filtro.HoraDesde && H.Hora <= filtro.HoraHasta
                                       && (E.Nombre == EstadoTurno.Reservado.ToString() || E.Nombre == EstadoTurno.Confirmado.ToString()
                                       || E.Nombre == EstadoTurno.Ingresado.ToString())
                                       && C.Id_centro_castracion == idCentroXSecretaria
                                  select new TurnosFiltradoSecretariaDTO
                                  {
                                       IdUsuario = U.IdUsuario,
                                       DNI = V.Dni,
                                       Telefono = V.Telefono,
                                       Nombre = U.Nombre.ToLower(),
                                       Apellido = U.Apellido.ToLower(),
                                       TipoServicio = TT.NombreTipo,
                                       IdHorario = H.IdHorario,
                                       Dia = T.Dia,
                                       Hora = H.Hora,
                                       Estado = E.Nombre,
                                       CentroCastracion = C.Nombre
                                       
                                  }).ToListAsync(); 

            return turnosHorarios;

        }

        private async Task<int?> ObtenerIdCentroXSecretaria(HttpContext context)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);


            int? idCentroXSecretaria = await (from SC in _dbContext.SecretariaxCentros
                                              where SC.IdUsuario == idUsuario
                                              select SC.IdCentroCastracion).FirstOrDefaultAsync(); 

            return idCentroXSecretaria;


        } 


        public async Task<bool> ConfirmarIngreso(int idHorario)
        {
            DateTime actual = DateTime.UtcNow;
            
            Horarios? horarioEstadoCambiar = await (from H in _dbContext.Horarios
                                            join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                            join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                            where (E.Nombre == EstadoTurno.Confirmado.ToString())
                                                   && T.Dia.Year == actual.Year
                                                   && T.Dia.Day == actual.Day
                                                   && H.IdHorario == idHorario
                                            select H).FirstOrDefaultAsync();

            if (horarioEstadoCambiar == null) { return false; }

            bool estadoCambiado = await this.CambiarEstado(EstadoTurno.Ingresado, horarioEstadoCambiar.IdHorario);

            if (!estadoCambiado) {
                return false;
            }

            return true;

        }


        public string CambiarTexto(EmailDTO texto, bool esCancelacion)
        {
            string timeString = texto.Hora;
            TimeSpan time = TimeSpan.Parse(timeString);
            string tiempoFormateado = $"{time.Hours}:{time.Minutes:D2} Hrs";

            DateTime fecha = DateTime.Parse(texto.Fecha);
            string fechaFormateada = fecha.ToString("dd-MM-yyyy");

            TextInfo textInfo = new CultureInfo("es-ES", false).TextInfo;

            string nombreFormateado = textInfo.ToTitleCase(texto.Nombre.ToLower());

            string tipoAnimalEmoji = texto.Tipo switch
            {
                "GATO" => "😺",
                "PERRO" => "🐶",
                _ => ""
            };

            string cancelacionTexto = !esCancelacion ? @"<tr>
                                                        <td style=""text-align: center; padding: 10px;"">
                                                            <p style=""font-size: 14px; background-color: #FFF4E0; padding: 15px; border-radius: 10px; display: inline-block; text-align: center; max-width: 450px; width: 100%; color: #C68642; font-weight: bold;"">
                                                                En caso de no poder asistir al turno programado, es importante que cancele o reprograme por medio de la 
                                                                <a href=""https://www.centroCastracion.com"" style=""color: #A0522D; ""><strong>página oficial</strong></a>
                                                            </p>
                                                        </td>
                                                    </tr>": String.Empty;


            string Body = $"{texto.Email}\n" + @"
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
                                    <h2 style=""color: #0072bc; font-size: 22px; margin-top: 30px;"">" + texto.TipoEmail + @"</h2>
                                  </td>
                                </tr>

                                <tr>
                                  <td style=""padding: 10px 20px;"">
                                    <p style=""color: #333333; font-size: 16px; margin: 0;"">
                                      Hola, "+ nombreFormateado + @". "+ texto.Mensaje + @"
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
                                      <strong>🏥 Centro Castración: " + texto.CentroCastracion + @" </strong>
                                    </p>
                                    <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                      <strong>🗓️ Fecha: </strong> " + fechaFormateada + @"
                                    </p>
                                    <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                      <strong>🕑 Hora: </strong> " + tiempoFormateado + @"
                                    </p>
                                    <p style=""color: #333333; font-size: 16px; margin: 5px 0;"">
                                      "+ tipoAnimalEmoji + @" <strong> Tipo de Animal: </strong> " + char.ToUpper(texto.Tipo[0]) + texto.Tipo.Substring(1).ToLower() + @"
                                    </p>
                                  </td>
                                </tr>              
                                " + cancelacionTexto + @"
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

        public async Task<List<TurnosFiltradoSecretariaDTO?>> ObtenerTurnoPorDNI(long dni)
        {
            List<TurnosFiltradoSecretariaDTO?> turnosHorarios = await (from H in _dbContext.Horarios
                                        join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                        join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                                        join U in _dbContext.Usuarios on H.Id_Usuario equals U.IdUsuario
                                        join V in _dbContext.Vecinos on U.IdUsuario equals V.Id_usuario
                                        join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                        join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                        join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                                        where V.Dni == dni
                                        select new TurnosFiltradoSecretariaDTO
                                        {
                                            DNI = V.Dni,
                                            Telefono = V.Telefono,
                                            Nombre = U.Nombre.ToLower(),
                                            Apellido = U.Apellido.ToLower(),
                                            TipoServicio = TT.NombreTipo,
                                            IdHorario = H.IdHorario,
                                            Dia = T.Dia,
                                            Hora = H.Hora,
                                            Estado = E.Nombre,
                                            CentroCastracion = C.Nombre

                                        }).ToListAsync();

            return turnosHorarios;

        }


        public async Task<List<HorariosCanceladosResponse>> ObtenerCanceladosPorCentro (TurnosSecretariaDTO filtro, HttpContext context)
        {
            int? idCentro = await this.ObtenerIdCentroXSecretaria(context);

            var turnosCancelados = await (from H in _dbContext.Horarios
                                          join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                          join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                          join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                          join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                                          where C.Id_centro_castracion == idCentro 
                                                && E.Nombre == EstadoTurno.Cancelado.ToString()
                                                && T.Dia >= filtro.FechaDesde && T.Dia <= filtro.FechaHasta
                                                && H.Hora >= filtro.HoraDesde && H.Hora <= filtro.HoraHasta
                                          select new HorariosCanceladosResponse
                                          {
                                              IdHorario = H.IdHorario,
                                              Dia = T.Dia,
                                              Hora = H.Hora,
                                              Estado = E.Nombre

                                          }).ToListAsync();

            return turnosCancelados;
        }

        public async Task<bool> TurnoEmergencia(TurnoUrgenteRequestDTO request) 
        {
            
            Mascota mascotaUrgente = await _mascotaRepository.CrearMascota(new MascotaDTO
            {
                Edad = request.Edad,
                Sexo = request.Sexo,
                Tamaño = request.TipoTamaño,
                TipoAnimal = request.TipoAnimal
            }, request.IdUsuario);

            if (mascotaUrgente == null)
                return false;

            Horarios? horarioUrgente = await CrearTurnoEmergencia(request.IdUsuario);

            if (horarioUrgente == null)
                return false;

            return await AsignarMascotaHorario(horarioUrgente, mascotaUrgente);

        
        }

        
        private async Task<Horarios?> CrearTurnoEmergencia(int? idUsuarioRequest)
        {
            DateTime actual = DateTime.Now;

            int? IdTipoTurnoEmergencia = await ObtenerTipoTurnoId(("Emergencia").ToUpper());

            if (IdTipoTurnoEmergencia.HasValue)
            {
                int? turnoId = await BuscarTurnoIdDelDia(actual);

                if (turnoId.HasValue)
                {
                    Horarios horarioCreado = await Crear(new Horarios
                    {
                        Hora = actual.TimeOfDay,
                        TipoTurno = IdTipoTurnoEmergencia.Value,
                        IdTurno = turnoId.Value,
                        Id_Estado = BuscarEstado(EstadoTurno.Ingresado.ToString()),
                        Id_Usuario = idUsuarioRequest,
                    });

                    return horarioCreado;
                }
                return null;
            }
            return null;
        }

        private async Task<int?> ObtenerTipoTurnoId(string nombreTipo)
        {
            TipoTurno? tipoTurnoEncontrado = await _dbContext.TipoTurnos.Where(tt => tt.NombreTipo == nombreTipo).FirstOrDefaultAsync();

            if (tipoTurnoEncontrado != null) {

                return tipoTurnoEncontrado.TipoId;
            
            }

            return null;

        }

        private async Task<int?> BuscarTurnoIdDelDia(DateTime fechaDelDia)
        {
            Turnos? turnoEncontrado = await _dbContext.Turnos.Where(t => t.Dia.Day == fechaDelDia.Day).FirstOrDefaultAsync();

            if (turnoEncontrado != null) 
            {
                return turnoEncontrado.IdTurno;
            }

            return null;
        }

        private async Task<bool> AsignarMascotaHorario(Horarios? horarioUrgente, Mascota? mascotaUrgente)
        {
            if (horarioUrgente != null && mascotaUrgente != null)
            {
                horarioUrgente.Id_mascota = mascotaUrgente.IdMascota;

                if (await Editar(horarioUrgente)){
                    return true;
                }
                return false;

            }
            return false;

        }

        public async Task<bool> FinalizarHorario(FinalizarTurnoDTO request)
        {
            if (!await EsEstado(EstadoTurno.Ingresado, request.IdHorario))
                return false;

            if (!await CambiarEstado(EstadoTurno.Realizado, request.IdHorario))
                return false;

            if (!await AgregarVeterinarioHorario(request.IdHorario, request.IdLegajoVeterinario)) 
                return false;

            if (!await _medicamentoxhorarioRepository.CrearMedicacionXHorario(request.Medicaciones, request.IdHorario))
                return false;

            if (!await ObtenerIdMascotaXHorario(request.IdHorario))
                return false;

            if (!await CambiarTextoPostOperatorioYEnvioCorreo(request.Medicaciones, request.IdHorario))
                return false;

            return true;


        }


        private async Task<bool> ObtenerIdMascotaXHorario(int? IdHorario)
        {
            Horarios? horarioEncontrado = await Obtener(h => h.IdHorario == IdHorario);

            if (horarioEncontrado == null)
               return false;

            if (!await _mascotaRepository.CambiarEstadoCastrado(horarioEncontrado.Id_mascota))
                return false;

            return true;


        }

        private async Task<bool> AgregarVeterinarioHorario(int? IdTurnoHorario, int? IdLegajo)
        {

            Horarios? horarioEntrado = await this.Obtener(h => h.IdHorario == IdTurnoHorario);

            if (horarioEntrado == null) return false;

            horarioEntrado.Id_Legajo = IdLegajo;

            if (!await Editar(horarioEntrado))
                return false;

            return true;

        }


        private async Task<bool> EsEstado(EstadoTurno estado, int IdHorario)
        {
            var estadoEncontrado = await (from H in _dbContext.Horarios
                                          join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                          where H.IdHorario == IdHorario
                                          && E.Nombre == estado.ToString()
                                          select H)
                                          .FirstOrDefaultAsync();

            if (estadoEncontrado == null)
                return false;

            return true;
        }

        private async Task<bool> CambiarTextoPostOperatorioYEnvioCorreo(List<MedicamentoxHorarioDTO>? medicamentos, int? idTurno )
        {

            Horarios? horarioEncontrado = _dbContext.Horarios.Where(h => h.IdHorario == idTurno).FirstOrDefault();

            if (horarioEncontrado == null)
                return false;

            Usuario? usuarioEncontrado = await _dbContext.Usuarios.Where(u => u.IdUsuario == horarioEncontrado.Id_Usuario).FirstOrDefaultAsync();

            if (usuarioEncontrado == null)
                return false;

            string? sexoAnimal = await ObtenerSexoPorHorario(idTurno);

            string mensaje = EnvioCorreosHTML.CrearHTMLPostOperatorio(medicamentos, new 
                EmailPostOpResponseDTO(){ 
                Email = usuarioEncontrado.Email, 
                Nombre = usuarioEncontrado.Nombre,
                Sexo = sexoAnimal
                
            });

            if (!await _emailPublisher.ConexionConRMQ(mensaje, "email_send"))
                return false;

            return true;
            
        }

        private async Task<string> ObtenerSexoPorHorario(int? idHorario)
        {
            string? sexo = await (from H in _dbContext.Horarios
                                 join M in _dbContext.Mascotas on H.Id_mascota equals M.IdMascota
                                 join S in _dbContext.Sexos on M.IdSexo equals S.IdSexos
                                 where H.IdHorario == idHorario
                                 select S.SexoTipo
                                 ).FirstOrDefaultAsync();

            return sexo!;
        }

    }
}
