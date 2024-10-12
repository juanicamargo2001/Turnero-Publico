using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IAgendaRepository : IGenericRepository<Agenda>
    {
        Task<bool> RegistrarAgenda(AgendaDTO agendaPrevia);
        bool EsFinDeSemana (DateTime fecha);
        Task<List<DateTime>> ObtenerFechaFeriados(DateTime fechaInicio, DateTime fechaFin);
        Task<List<DateTime>?> FechasHabiles(DateTime fechaInicio, DateTime fechaFin);




    }
}
