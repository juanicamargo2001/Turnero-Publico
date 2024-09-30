using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IVeterinarioRepository : IGenericRepository<Veterinario>
    {

        Task<Veterinario> buscarPorDocumento(int dni);

    }
}
