using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface ITurnosRepository : IGenericRepository<Turnos>
    {
        Task<bool> CrearTurnosAgenda(TurnoHorarioCentroDTO turnoHorarioDTO);

        Task<List<TurnoDTO>> ObtenerTurnosHabiles(int IdCentroCastracion, DateTime dia);

        Task<List<DateTime>> ObtenerDiasTurnos(int IdCentroCastracion);

    }
}
