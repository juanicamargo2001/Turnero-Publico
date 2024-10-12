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
        Task<bool> FechasDisponibles(AgendaDTO agendaPrevia);
        bool EsFinDeSemana (DateTime fecha);
        Task<List<DateTime>> obtenerFechaFeriados(DateTime fechaInicio, DateTime fechaFin);


    }
}
