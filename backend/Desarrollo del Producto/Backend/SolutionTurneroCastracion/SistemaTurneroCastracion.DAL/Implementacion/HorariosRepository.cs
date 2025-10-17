using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
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
    public class HorariosRepository : GenericRepository<Horarios>, IHorariosRepository
    {
        protected readonly CentroCastracionContext _dbContext;
        private readonly EmailPublisher _emailPublisher;
        private readonly ICorreosProgramados _correosProgramados;
        private readonly IMascotaRepository _mascotaRepository;
        private readonly IMedicamentoxhorarioRepository _medicamentoxhorarioRepository;
        private readonly ICalificacionRepository _calificacionRepository;

        public HorariosRepository(CentroCastracionContext dbContext, ICorreosProgramados correosProgramados,
                                  EmailPublisher emailPublisher, IMascotaRepository mascotaRepository,
                                  IMedicamentoxhorarioRepository medicamentoxhorarioRepository,
                                  ICalificacionRepository calificacionRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _emailPublisher = emailPublisher;
            _correosProgramados = correosProgramados;
            _mascotaRepository = mascotaRepository;
            _medicamentoxhorarioRepository = medicamentoxhorarioRepository;
            _calificacionRepository = calificacionRepository;
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


        public async Task<bool> CambiarEstado(EstadoTurno estadoTurno, int id_Horario)
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
            EmailDTO? email = await this.ObtenerInformacionEmail(idUsuario, horarioMascota.IdTurnoHorario, "Registro de Turno", "Hemos agendado correctamente el turno para ");

            string mensaje = EnvioCorreosHTML.CrearHTMLRegistroCancelacion(email, esCancelacion: false);

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

            var tieneEmergencias = await (from H in _dbContext.Horarios
                                          join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                          join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                                          where H.Id_Usuario == idUsuario
                                                && TT.NombreTipo == "EMERGENCIA"
                                                && T.Dia.Year == fechaFin!.Value.Year
                                                && T.Dia.Month == fechaFin.Value.Month
                                          select H).AnyAsync();

            if (tieneEmergencias)
                return false;

            return await (from H in _dbContext.Horarios
                          join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                          join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                          where H.Id_Usuario == idUsuario
                                && TT.NombreTipo != "EMERGENCIA"
                                && T.Dia.Year == fechaFin.Value.Year
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

        public async Task<bool> CancelarTurno(CancelacionRequestDTO request, HttpContext httpContext)
        {

            request.IdUsuario ??= httpContext != null ? UtilidadesUsuario.ObtenerIdUsuario(httpContext) : null;

            Console.WriteLine(request.IdUsuario.ToString());

            if (!await EsEstado(EstadoTurno.Reservado, request.IdHorario))
                return false;


            if (!await this.CambiarEstado(EstadoTurno.Libre, request.IdHorario))
                return false;


            Horarios? cancelarUsuario = _dbContext.Horarios.Where(h => h.IdHorario == request.IdHorario).FirstOrDefault();

            if (cancelarUsuario == null)
                return false;

            EmailDTO? email = await this.ObtenerInformacionEmail(request.IdUsuario, request.IdHorario, "Cancelación de Turno", "Hemos cancelado correctamente el turno de ");

            cancelarUsuario.Id_Usuario = null;


            if (!await this.Editar(cancelarUsuario))
                return false;


            string mensaje = EnvioCorreosHTML.CrearHTMLRegistroCancelacion(email, esCancelacion: true);

            await _emailPublisher.ConexionConRMQ(mensaje, "email_send");


            if (!await _correosProgramados.BorrarCorreo(request.IdHorario))
                return false;

            return true;


        }



        public async Task<EmailDTO?> ObtenerInformacionEmail(int? idUsuario, int IdHorario, string tipoMensaje, string mensaje)
        {
            var emailDTO = (from U in _dbContext.Usuarios
                            join H in _dbContext.Horarios on U.IdUsuario equals H.Id_Usuario
                            join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                            join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                            join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                            join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                            join M in _dbContext.Mascotas on H.Id_mascota equals M.IdMascota
                            where H.IdHorario == IdHorario && U.IdUsuario == idUsuario
                            select new EmailDTO
                            {
                                TipoEmail = tipoMensaje,
                                Email = U.Email,
                                Nombre = U.Nombre,
                                CentroCastracion = C.Nombre,
                                Fecha = T.Dia.ToString(),
                                Hora = H.Hora.ToString() ?? String.Empty,
                                Tipo = TT.NombreTipo,
                                Mensaje = mensaje,
                                NombreMascota = M.Nombre

                            }).FirstOrDefault();

            return emailDTO;
        }

        public async Task<bool> ConfirmarTurno(string token)
        {
            TurnosTokens? turnosTokens = await _dbContext.TurnosTokens.Where(tk => tk.Token == token && !tk.Usado).FirstOrDefaultAsync();

            if (turnosTokens != null)
            {
                bool esDiaActual = await this.EsDiaActual(turnosTokens.IdHorario, turnosTokens.IdUsuario);

                if (esDiaActual)
                {
                    if (!await this.CambiarEstado(EstadoTurno.Confirmado, turnosTokens.IdHorario))
                        return false;

                    turnosTokens.FechaExpiracion = turnosTokens.FechaExpiracion.AddDays(-2); //forzar a que se venza la formula computarizada
                                                                                             //para no poder usar de vuelta el mismo token único.

                    _dbContext.Update(turnosTokens);

                    await _dbContext.SaveChangesAsync();

                    return true;
                }
            }
            return false;
        }

        private async Task<bool> EsDiaActual(int idHorario, int? id)
        {
            DateTime actual = DateTime.UtcNow;
            DateTime haceDosDias = actual.AddDays(2).Date;

            int? idRol = await BuscarIdRol(RolesEnum.secretaria);


            bool esSecretaria = await (from U in _dbContext.Usuarios
                                       join R in _dbContext.Roles on U.RolId equals R.IdRol
                                       where U.IdUsuario == id
                                       && R.IdRol == idRol
                                       select U).AnyAsync();


            var turnoHabilitadoConfirmacion = await (
                from H in _dbContext.Horarios
                join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                where H.IdHorario == idHorario
                      && T.Dia <= haceDosDias
                      && (H.Id_Usuario == id || esSecretaria)
                      && E.Nombre == EstadoTurno.Reservado.ToString()
                select H
            ).ToListAsync();

            if (turnoHabilitadoConfirmacion.Count > 0) {
                return true;
            }

            return false;

        }

        private async Task<int?> BuscarIdRol(RolesEnum rol)
        {

            int? rolId = await (from R in _dbContext.Roles
                                where R.Nombre == rol.ToString()
                                select R.IdRol).FirstOrDefaultAsync();

            return rolId;
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

        public async Task<List<TurnosFiltradoSecretariaDTO?>> ObtenerTurnoPorDNI(long dni)
        {
            List<TurnosFiltradoSecretariaDTO?> turnosHorarios = await (from U in _dbContext.Usuarios
                                                                       join V in _dbContext.Vecinos on U.IdUsuario equals V.Id_usuario
                                                                       where V.Dni == dni
                                                                       join H in _dbContext.Horarios on U.IdUsuario equals H.Id_Usuario into horariosGroup
                                                                       from H in horariosGroup.DefaultIfEmpty()
                                                                       join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno into turnosGroup
                                                                       from T in turnosGroup.DefaultIfEmpty()
                                                                       join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId into tiposGroup
                                                                       from TT in tiposGroup.DefaultIfEmpty()
                                                                       join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado into estadosGroup
                                                                       from E in estadosGroup.DefaultIfEmpty()
                                                                       join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda into agendasGroup
                                                                       from A in agendasGroup.DefaultIfEmpty()
                                                                       join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion into centrosGroup
                                                                       from C in centrosGroup.DefaultIfEmpty()
                                                                       orderby T.Dia descending, H.Hora descending
                                                                       select new TurnosFiltradoSecretariaDTO
                                                                       {
                                                                           DNI = V.Dni,
                                                                           Telefono = V.Telefono,
                                                                           Nombre = U.Nombre.ToLower(),
                                                                           Apellido = U.Apellido.ToLower(),
                                                                           TipoServicio = TT.NombreTipo,
                                                                           IdHorario = H != null ? H.IdHorario : 0,
                                                                           Dia = T.Dia,
                                                                           Hora = H != null ? H.Hora : null,
                                                                           Estado = E.Nombre,
                                                                           CentroCastracion = C.Nombre,
                                                                           IdUsuario = U.IdUsuario
                                                                       }).ToListAsync();
            return turnosHorarios;

        }


        public async Task<List<HorariosCanceladosResponse>> ObtenerCanceladosPorCentro(TurnosSecretariaDTO filtro)
        {

            var turnosCancelados = await (from H in _dbContext.Horarios
                                          join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                          join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                          join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                          join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                                          where E.Nombre == EstadoTurno.Cancelado.ToString()
                                                && T.Dia >= filtro.FechaDesde && T.Dia <= filtro.FechaHasta
                                                && H.Hora >= filtro.HoraDesde && H.Hora <= filtro.HoraHasta
                                          select new HorariosCanceladosResponse
                                          {
                                              IdHorario = H.IdHorario,
                                              Dia = T.Dia,
                                              Hora = H.Hora,
                                              Estado = E.Nombre,
                                              CentroCastracion = C.Nombre

                                          }).ToListAsync();

            return turnosCancelados;
        }

        public async Task<bool> TurnoEmergencia(TurnoUrgenteRequestDTO request, HttpContext context)
        {
            int? idSecretaria = UtilidadesUsuario.ObtenerIdUsuario(context);

            Mascota mascotaUrgente = await _mascotaRepository.CrearMascota(new MascotaDTO
            {
                Edad = request.Edad,
                Sexo = request.Sexo,
                Tamaño = request.TipoTamaño,
                TipoAnimal = request.TipoAnimal,
                Raza = request.Raza ?? string.Empty
            }, request.IdUsuario);

            if (mascotaUrgente == null)
                return false;

            Horarios? horarioUrgente = await CrearTurnoEmergencia(request.IdUsuario, idSecretaria);

            if (horarioUrgente == null)
                return false;

            return await AsignarMascotaHorario(horarioUrgente, mascotaUrgente);


        }


        private async Task<Horarios?> CrearTurnoEmergencia(int? idUsuarioRequest, int? idSecretaria)
        {
            DateTime actual = DateTime.UtcNow;

            int? IdTipoTurnoEmergencia = await ObtenerTipoTurnoId(("Emergencia").ToUpper());

            if (IdTipoTurnoEmergencia.HasValue)
            {
                int? turnoId = await BuscarTurnoIdDelDia(actual, idSecretaria);

                Horarios horarioCreado = await Crear(new Horarios
                {
                    Hora = actual.AddHours(-3).TimeOfDay,
                    TipoTurno = IdTipoTurnoEmergencia.Value,
                    IdTurno = turnoId,
                    Id_Estado = BuscarEstado(EstadoTurno.Ingresado.ToString()),
                    Id_Usuario = idUsuarioRequest,
                });

                return horarioCreado;

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

        private async Task<int?> BuscarTurnoIdDelDia(DateTime fechaDelDia, int? idSecretaria)
        {
            Turnos? turnoEncontrado = await _dbContext.Turnos.Where(t => t.Dia.Date == fechaDelDia.Date).FirstOrDefaultAsync();

            if (turnoEncontrado != null)
            {
                return turnoEncontrado.IdTurno;
            }

            try
            {
                var agendaId = await (from A in _dbContext.Agenda
                                      join SA in _dbContext.SecretariaxCentros on A.IdCentroCastracion equals SA.IdCentroCastracion
                                      where SA.IdUsuario == idSecretaria
                                      orderby A.IdAgenda descending
                                      select A.IdAgenda).FirstOrDefaultAsync();


                Turnos nuevoTurno = new() { Dia = fechaDelDia, IdAgenda = agendaId };
                await _dbContext.Turnos.AddAsync(nuevoTurno);
                await _dbContext.SaveChangesAsync();


                return nuevoTurno.IdTurno;
            }
            catch
            {
                return null;
            }

        }

        private async Task<bool> AsignarMascotaHorario(Horarios? horarioUrgente, Mascota? mascotaUrgente)
        {
            if (horarioUrgente != null && mascotaUrgente != null)
            {
                horarioUrgente.Id_mascota = mascotaUrgente.IdMascota;

                if (await Editar(horarioUrgente)) {
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

            if (!await AgregarVeterinarioHorarioObservacion(request.IdHorario, request.IdLegajoVeterinario, request.Observacion))
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

        private async Task<bool> AgregarVeterinarioHorarioObservacion(int? IdTurnoHorario, int? IdLegajo, string? observacion)
        {

            Horarios? horarioEntrado = await this.Obtener(h => h.IdHorario == IdTurnoHorario);

            if (horarioEntrado == null) return false;

            horarioEntrado.Id_Legajo = IdLegajo;
            horarioEntrado.Observacion = observacion;

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

        private async Task<bool> CambiarTextoPostOperatorioYEnvioCorreo(List<MedicamentoxHorarioDTO>? medicamentos, int? idTurno)
        {

            Horarios? horarioEncontrado = _dbContext.Horarios.Where(h => h.IdHorario == idTurno).FirstOrDefault();

            if (horarioEncontrado == null)
                return false;

            Usuario? usuarioEncontrado = await _dbContext.Usuarios.Where(u => u.IdUsuario == horarioEncontrado.Id_Usuario).FirstOrDefaultAsync();

            if (usuarioEncontrado == null)
                return false;

            int idCentroCastracion = await (from T in _dbContext.Turnos
                                            join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                            join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                                            where T.IdTurno == horarioEncontrado.IdTurno
                                            select C.Id_centro_castracion).FirstOrDefaultAsync();

            string token = await _calificacionRepository.CrearCalificacion(new CalificacionRequest() {
                IdCentroCastracion = idCentroCastracion,
                IdUsuario = usuarioEncontrado.IdUsuario });


            string? sexoAnimal = await ObtenerSexoPorHorario(idTurno);

            string mensaje = EnvioCorreosHTML.CrearHTMLPostOperatorio(medicamentos,
                new EmailPostOpResponseDTO() {
                    Email = usuarioEncontrado.Email,
                    Nombre = usuarioEncontrado.Nombre,
                    Sexo = sexoAnimal
                }, token);

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


        public async Task<bool> CancelacionMasiva(RequestCancelacionesMasivas request)
        {
            List<CancelacionMasivaDTO> cancelacionesBatch = await (from H in _dbContext.Horarios
                                                                   join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                                                   join U in _dbContext.Usuarios on H.Id_Usuario equals U.IdUsuario
                                                                   join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                                                   join C in _dbContext.Centros on A.IdCentroCastracion equals C.Id_centro_castracion
                                                                   join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                                                   where request.IdCentroCastracion.Contains(A.IdCentroCastracion)
                                                                   && T.Dia.Day == request.DiaCancelacion.Day
                                                                   && (E.Nombre == EstadoTurno.Reservado.ToString() ||
                                                                       E.Nombre == EstadoTurno.Confirmado.ToString())
                                                                   select new CancelacionMasivaDTO
                                                                   {
                                                                       Nombre = U.Nombre,
                                                                       Motivo = request.Motivo,
                                                                       Hora = H.Hora.Value,
                                                                       Email = U.Email,
                                                                       Dia = T.Dia,
                                                                       Horario = H
                                                                   }).ToListAsync();


            foreach (var cancelacion in cancelacionesBatch)
            {
                try
                {
                    string mensaje = EnvioCorreosHTML.CrearHTMLCancelacionMasiva(cancelacion);
                    await _emailPublisher.ConexionConRMQ(mensaje, "email_send_bach");
                    cancelacion.Horario.Id_Estado = BuscarEstado(EstadoTurno.Libre.ToString());
                    cancelacion.Horario.Id_Usuario = null;
                    cancelacion.Horario.Id_mascota = null;
                    cancelacion.Horario.Id_Legajo = null;

                    await Editar(cancelacion.Horario);

                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return false;
                }
            }

            return true;
        }


        public async Task<bool> FinalizarTurnoFallido(FinalizarTurnoFallidoRequest request)
        {
            if (!await EsEstado(EstadoTurno.Ingresado, request.IdHorario))
                return false;

            if (!await CambiarEstado(EstadoTurno.Fallido, request.IdHorario))
                return false;

            if (!await AgregarVeterinarioHorarioObservacion(request.IdHorario, request.IdLegajoVeterinario, request.Observacion))
                return false;

            if (!await ObtenerIdMascotaXHorario(request.IdHorario))
                return false;

            return true;
        }

        public async Task<InformacionTurnoFinalizadoDTO?> ObtenerTurnoFinalizacion(int idHorario)
        {
            InformacionTurnoFinalizadoDTO? resultado = await (from H in _dbContext.Horarios
                                                              join V in _dbContext.Veterinarios on H.Id_Legajo equals V.IdLegajo
                                                              where H.IdHorario == idHorario
                                                              select new InformacionTurnoFinalizadoDTO
                                                              {
                                                                  NombreVeterinario = V.Nombre,
                                                                  Matricula = V.Matricula.ToString(),
                                                                  Observacion = H.Observacion,
                                                                  Medicaciones = (from MH in _dbContext.MedicacionxHorarios
                                                                                  join Me in _dbContext.Medicacion on MH.IdMedicamento equals Me.IdMedicacion
                                                                                  join U in _dbContext.UnidadMedidas on MH.IdUnidadMedida equals U.IdUnidad
                                                                                  where MH.IdHorario == H.IdHorario
                                                                                  select new MedicamentoxHorarioDTO
                                                                                  {
                                                                                      Medicamento = Me.Nombre,
                                                                                      Dosis = (float)Convert.ToDouble(MH.Dosis),
                                                                                      UnidadMedida = U.TipoUnidad,
                                                                                      Descripcion = MH.Descripcion
                                                                                  }).ToList()
                                                              }).FirstOrDefaultAsync();

            return resultado;

        }
    }
}
