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

        public AgendaRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public bool EsFinDeSemana(DateTime fecha)
        {
            if (fecha.DayOfWeek == DayOfWeek.Sunday || fecha.DayOfWeek == DayOfWeek.Saturday) {

                return true;
            }
            return false;
        }

        public async Task<bool> FechasDisponibles(AgendaDTO agendaPrevia)
        {
            DateTime fechaInicio = agendaPrevia.FechaInicio;

            DateTime fechaFin = fechaInicio.AddMonths(1).AddDays(DateTime.DaysInMonth(fechaInicio.Year, fechaInicio.Month + 1) - fechaInicio.Day);

            return true;

        }

        public async Task<List<DateTime>?> obtenerFechaFeriados(DateTime fechaInicio, DateTime fechaFin)
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
