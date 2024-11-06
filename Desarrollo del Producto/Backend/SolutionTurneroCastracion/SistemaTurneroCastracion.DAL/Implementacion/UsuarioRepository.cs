using SistemaTurneroCastracion.BLL;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class UsuarioRepository : GenericRepository<Usuario>, IUsuarioRepository
    {

        protected readonly CentroCastracionContext _dbContext;

        public UsuarioRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<int?> crearCuentaVecino(string nombre, string apellido, string contraseña)
        {
            string convertirContraseña = UtilidadesUsuario.EncriptarClave(contraseña);

            int numeroId = (_dbContext.Roles.Where(e => e.Nombre == "vecino").FirstOrDefault()!).IdRol;

            Usuario usuarioCreado = await this.Crear(new Usuario { Nombre = nombre, Apellido = apellido, Contraseña = convertirContraseña, RolId = numeroId });

            if (usuarioCreado == null) {
                return 0;
            }
            return usuarioCreado.IdUsuario;


        }

  

    }
}
