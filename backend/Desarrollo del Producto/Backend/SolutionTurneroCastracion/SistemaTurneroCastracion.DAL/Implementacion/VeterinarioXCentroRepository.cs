using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
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
    public class VeterinarioXCentroRepository : GenericRepository<VeterinarioxCentro>, IVeterinarioXCentroRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public VeterinarioXCentroRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> crearVeterinarioXCentro(int legajo, string nombre)
        {
            try
            {
                var parameters = new[]
                {
                new SqlParameter("@Legajo", legajo),
                new SqlParameter("@Nombre", nombre)
                };

                int resultado = await _dbContext.Database.ExecuteSqlRawAsync("EXEC sp_postVeterinarioCentro @Legajo, @Nombre", parameters);

                return resultado > 0;
            } catch
            {
                return false;
            }
        }

        public async Task<bool> eliminarVeterinarioXCentro(int legajo, string nombre)
        {
            try
            {
                var parameters = new[]
                {
                new SqlParameter("@Legajo", legajo),
                new SqlParameter("@Nombre", nombre)
                };

                int resultado = await _dbContext.Database.ExecuteSqlRawAsync("EXEC sp_deleteVeterinarioCentro @Legajo, @Nombre", parameters);

                return resultado > 0;
            }
            catch
            {
                return false;
            }
        }

    }
}
