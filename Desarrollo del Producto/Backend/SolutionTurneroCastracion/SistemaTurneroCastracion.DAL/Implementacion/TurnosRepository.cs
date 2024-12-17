using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.IdentityModel.Tokens;
using SistemaTurneroCastracion.BLL;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class TurnosRepository : GenericRepository<Turnos>, ITurnosRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        private readonly IHorariosRepository _horariosRepository;

        private readonly IUsuarioRepository _usuarioRepository;


        public TurnosRepository(CentroCastracionContext dbContext, IHorariosRepository horariosRepository, IUsuarioRepository usuarioRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _horariosRepository = horariosRepository;
            _usuarioRepository = usuarioRepository;
        }


        public async Task<bool> CrearTurnosAgenda(TurnoHorarioCentroDTO turnoHorarioDTO)
        {
            List<Turnos> turnoNuevo = [];

            int mes = turnoHorarioDTO.TurnosAgenda[0].Month;

            List<DateTime> turnosFiltrados = turnoHorarioDTO.TurnosAgenda.Where(fecha => fecha.Month != mes).ToList();


            foreach (var turno in turnosFiltrados)
            {
                turnoNuevo.Add(new Turnos
                {
                    Dia = turno,
                    IdAgenda = turnoHorarioDTO.IdAgenda
                });
            }

            try
            {
                _dbContext.Turnos.AddRange(turnoNuevo);
                _dbContext.SaveChanges();

                for (int i = 0; i < turnosFiltrados.Count; i++) {
                    foreach (var franja in turnoHorarioDTO.FranjasHorarias)
                    {
                        await _horariosRepository.crearHorarios(new HorarioCentroParametroDTO
                        {
                            IdCentroCastracion = turnoHorarioDTO.IdCentroCastracion,
                            IdTurno = turnoNuevo[i].IdTurno,
                            IdTipoTurno = franja.IdTipoTurno,
                            Cantidad = franja.Cantidad,
                            InicioTrabajo = turnoHorarioDTO.Inicio,
                            FinTrabajo = turnoHorarioDTO.Fin,
                            HoraInicio = franja.HoraInicio,
                            HoraFin = franja.HorarioFin
                        });
                    }


                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
            return true;
        }

        public async Task<List<TurnoDTO>> ObtenerTurnosHabiles(int IdCentroCastracion, DateTime dia, string tipoAnimal)
        {
            DateTime ahora = DateTime.UtcNow.AddHours(-3);

            if (DateTime.UtcNow.Day <= dia.Day)
            {
                var turnos = await (from C in _dbContext.Centros
                              join A in _dbContext.Agenda on C.Id_centro_castracion equals A.IdCentroCastracion
                              join T in _dbContext.Turnos on A.IdAgenda equals T.IdAgenda
                              join H in _dbContext.Horarios on T.IdTurno equals H.IdTurno
                              join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                              join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                              where C.Id_centro_castracion == IdCentroCastracion && T.Dia == dia && E.Nombre == EstadoTurno.Libre.ToString()
                              && TT.NombreTipo == tipoAnimal && (T.Dia > ahora.Date || H.Hora >= ahora.TimeOfDay)
                                    group new { H, TT } by new { T.Dia } into g
                              select new TurnoDTO
                              {
                                  Dia = g.Key.Dia,
                                  Hora = g.Select(h => new HoraTurnoResponseDTO
                                  {
                                      IdHorario = h.H.IdHorario,
                                      Hora = h.H.Hora,
                                      TipoTurno = h.TT.NombreTipo
                                  }).ToList()
                              }).ToListAsync();

                return turnos;
            }
            return [];
        }

        public async Task<List<DateTime>> ObtenerDiasTurnos(int IdCentroCastracion, string tipoAnimal)
        {
            DateTime ahora = DateTime.UtcNow.AddHours(-3);

            var turnosDias = (from C in _dbContext.Centros
                              join A in _dbContext.Agenda on C.Id_centro_castracion equals A.IdCentroCastracion
                              join T in _dbContext.Turnos on A.IdAgenda equals T.IdAgenda
                              join H in _dbContext.Horarios on T.IdTurno equals H.IdTurno
                              join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                              join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                              where C.Id_centro_castracion == IdCentroCastracion && TT.NombreTipo == tipoAnimal
                              && E.Nombre == EstadoTurno.Libre.ToString()
                              && DateTime.UtcNow.Day <= T.Dia.Day 
                              && (T.Dia > ahora.Date || H.Hora >= ahora.TimeOfDay)
                              select T.Dia
                             ).Distinct().ToList();
            return turnosDias;
        }



        public async Task<List<TurnoUsuario>> ObtenerTurnosUsuario(HttpContext context)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            var turnosUsuarios = (from H in _dbContext.Horarios
                                  join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                  join TT in _dbContext.TipoTurnos on H.TipoTurno equals TT.TipoId
                                  join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                  where H.Id_Usuario == idUsuario
                                  select new TurnoUsuario
                                  {
                                      IdHorario = H.IdHorario,
                                      Hora = H.Hora,
                                      TipoTurno = TT.NombreTipo,
                                      DiaTurno = T.Dia,
                                      Estado = E.Nombre
                                  }
                                  ).ToList();

            return turnosUsuarios;
        }

        public async Task<bool> EliminarTurnos(int idAgenda)
        {
            List<Turnos> turnosBorrar = await (from T in _dbContext.Turnos
                                               join A in _dbContext.Agenda on T.IdAgenda equals A.IdAgenda
                                               where T.IdAgenda == idAgenda
                                               select T).ToListAsync(); 

            if(turnosBorrar.Count > 0){

                try
                {

                    bool horariosEliminados = await _horariosRepository.EliminarHorarios(idAgenda);

                    if (horariosEliminados)
                    {
                        _dbContext.RemoveRange(turnosBorrar);
                        await _dbContext.SaveChangesAsync();

                        return true;

                    }

                    
                }
                catch (Exception ex) {

                    Console.WriteLine(ex.Message);
                    return false;
                    
                }

            }
            return false;


        }


    }    
}
