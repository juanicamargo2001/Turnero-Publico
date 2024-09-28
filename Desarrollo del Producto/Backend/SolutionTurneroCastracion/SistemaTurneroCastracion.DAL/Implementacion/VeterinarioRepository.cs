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
    public class VeterinarioRepository : GenericRepository<Veterinario>, IVeterinarioRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public VeterinarioRepository(CentroCastracionContext dbContext) : base(dbContext) { 
        
            _dbContext = dbContext;
        }




    }
}
