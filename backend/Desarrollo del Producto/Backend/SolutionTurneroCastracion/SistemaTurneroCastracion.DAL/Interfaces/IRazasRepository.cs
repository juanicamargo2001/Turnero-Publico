using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IRazasRepository : IGenericRepository<Razas>
    {
        Task<List<RazasDTO>?> ObtenerTodasPorTipoAnimal(string tipoRaza, string animalBusqueda);
    }
}
