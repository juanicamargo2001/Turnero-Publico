using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IHorariosRepository : IGenericRepository<Horarios>
    {
        Task<bool> crearHorarios(HorarioCentroParametroDTO centro);

    }
}
