using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class AgendaRepository : GenericRepository<Agenda>, IAgendaRepository
    {
        protected readonly CentroCastracionContext _dbContext;
        private readonly ITurnosRepository _turnosRepository;

        public AgendaRepository(CentroCastracionContext dbContext, ITurnosRepository turnosRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _turnosRepository = turnosRepository;
        }

        public bool EsFinDeSemana(DateTime fecha)
        {
            if (fecha.DayOfWeek == DayOfWeek.Sunday || fecha.DayOfWeek == DayOfWeek.Saturday) {

                return true;
            }
            return false;
        }

        public async Task<bool> RegistrarAgenda(AgendaDTO agendaPrevia)
        {
            DateTime fechaInicio = agendaPrevia.FechaInicio;

            DateTime fechaFin;

            if (fechaInicio.Month == 12)
            {
                fechaFin = new DateTime(fechaInicio.Year + 1, 1, fechaInicio.Day)
                    .AddDays(DateTime.DaysInMonth(fechaInicio.Year + 1, 1) - fechaInicio.Day);
            }
            else
            {
                fechaFin = fechaInicio.AddMonths(1).AddDays(DateTime.DaysInMonth(fechaInicio.Year, fechaInicio.Month + 1) - fechaInicio.Day);
            }

            List<DateTime>? fechasHabilitadas = await this.FechasHabiles(fechaInicio, fechaFin);      

            try
            {
                foreach (var centro in agendaPrevia.CentroCastraciones)
                {
                    if (!await esAgendaCreada(fechaFin, centro.IdCentro))
                    {
                        HorasLaboralesDTO centroHorarios = await this.obtenerHorasLaborales(centro.IdCentro);

                        TimeSpan? inicio = centroHorarios.HoraLaboralInicio;
                        TimeSpan? fin = centroHorarios.HoraLaboralFin;

                        int maxTurnos = (int)((fin - inicio)?.TotalMinutes / 30)!;

                        int? totalTurnosSolicitados = centro.CantidadTurnosGatos + centro.CantidadTurnosPerros;

                        if (totalTurnosSolicitados <= maxTurnos)
                        {
                            Agenda agendaCreada = await this.Crear(new Agenda
                            {
                                Fecha_inicio = fechaInicio,
                                Fecha_fin = fechaFin,
                                CantidadTurnosGatos = centro.CantidadTurnosGatos,
                                CantidadTurnosPerros = centro.CantidadTurnosPerros,
                                CantidadTurnosEmergencia = centro.CantidadTurnosEmergencia,
                                IdCentroCastracion = centro.IdCentro
                            });

                            if (fechasHabilitadas.Any())
                            {
                                bool turnosRegistrados = await _turnosRepository.CrearTurnosAgenda(
                                            new TurnoHorarioCentroDTO
                                            {
                                                TurnosAgenda = fechasHabilitadas,
                                                IdAgenda = agendaCreada.IdAgenda,
                                                IdCentroCastracion = agendaCreada.IdCentroCastracion,
                                                CantidadTurnosGato = centro.CantidadTurnosGatos,
                                                CantidadTurnosPerros = centro.CantidadTurnosPerros,
                                                Inicio = inicio,
                                                Fin = fin
                                            });
                            }
                        }
                        else
                        {
                            return false;
                        }
                    }else 
                    {  
                        return false;
                    }
                }
                
            } catch
            {
                return false;
            }
            return true;
        }

        public async Task<List<DateTime>?> FechasHabiles(DateTime fechaInicio, DateTime fechaFin)
        {
            List<DateTime>? feriados = await this.ObtenerFechaFeriados(fechaInicio, fechaFin);

            List<DateTime> fechasHabiles = new List<DateTime>();


            while (fechaInicio < fechaFin)
            {
                fechaInicio = fechaInicio.AddDays(1);

                if (!this.EsFinDeSemana(fechaInicio) && !feriados.Contains(fechaInicio))
                {
                    fechasHabiles.Add(fechaInicio);
                }
            }
           
            return fechasHabiles;
        }


        public async Task<List<DateTime>?> ObtenerFechaFeriados(DateTime fechaInicio, DateTime fechaFin)
        {
            var ctx = _dbContext;

            var feriados = ctx.Feriados.Where(f => f.Fecha >= fechaInicio && f.Fecha <= fechaFin)
                           .Select(f => f.Fecha)
                           .ToList();

            if (!feriados.Any()) {

                return null;
            }
            return feriados;
        }

        public async Task<HorasLaboralesDTO> obtenerHorasLaborales(int idCentroCastracion)
        {
            var centro = await _dbContext.Centros
                                  .Where(c => c.Id_centro_castracion == idCentroCastracion)
                                  .Select(c => new HorasLaboralesDTO
                                  {
                                      HoraLaboralInicio = c.HoraLaboralInicio,
                                      HoraLaboralFin = c.HoraLaboralFin
                                  })
                                  .FirstOrDefaultAsync();
            return centro;

        }

        public async Task<bool> esAgendaCreada(DateTime fechaFin, int idCentro)
        {
            var agendaCreada = await this.Consultar(a => a.Fecha_fin == fechaFin && a.IdCentroCastracion == idCentro);

            if (agendaCreada.Any()) { return true; }

            return false;

        }

    }
}
