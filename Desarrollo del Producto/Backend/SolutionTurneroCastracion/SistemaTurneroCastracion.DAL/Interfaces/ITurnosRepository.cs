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
        Task<bool> CrearTurnosAgenda(List<DateTime> turnosAgenda, int? IdAgenda, int idCentroCastracion, int? cantidadTurnosGato, int? cantidadTurnosPerros);

        Task<List<TurnoDTO>> ObtenerTurnosHabiles(int IdCentroCastracion);

    }
}
