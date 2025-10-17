using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IVeterinarioXCentroRepository : IGenericRepository<VeterinarioxCentro>
    {

        Task<bool> crearVeterinarioXCentro(int legajo, string nombre);
        Task<bool> eliminarVeterinarioXCentro(int legajo, string nombre);

    }
}
