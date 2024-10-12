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
                        bool turnosRegistrados = await _turnosRepository.CrearTurnosAgenda(fechasHabilitadas, agendaCreada.IdAgenda);

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
    }
}
