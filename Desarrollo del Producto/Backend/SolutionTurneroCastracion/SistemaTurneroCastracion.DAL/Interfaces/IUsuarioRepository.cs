using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IUsuarioRepository : IGenericRepository<Usuario> 
    {
        Task<int?> crearCuentaVecino(string nombre, string apellido, string contraseña);
    }
}
