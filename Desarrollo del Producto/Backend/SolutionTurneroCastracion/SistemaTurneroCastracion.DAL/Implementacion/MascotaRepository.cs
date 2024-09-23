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
    public class MascotaRepository : GenericRepository<Mascota>, IMascotaRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public MascotaRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

    }
}
