using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IUnidadMedidaRepository : IGenericRepository<UnidadMedida>
    {
        Task<bool> CrearUnidad(string unidad);
    }
}
