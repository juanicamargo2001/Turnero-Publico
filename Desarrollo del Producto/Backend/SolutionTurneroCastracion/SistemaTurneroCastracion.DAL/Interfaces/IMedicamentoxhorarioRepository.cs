using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IMedicamentoxhorarioRepository : IGenericRepository<MedicacionxHorario>
    {
        Task<bool> CrearMedicacionXHorario(List<MedicamentoxHorarioDTO>? medicamentoxHorarios, int idHorario);
    }
}
