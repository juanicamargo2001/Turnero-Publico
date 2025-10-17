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
    public class TipoAnimalRepository : GenericRepository<TiposAnimal>, ITipoAnimalRepository
    {
        protected readonly CentroCastracionContext _dbContext;


        public TipoAnimalRepository(CentroCastracionContext dbContext) : base(dbContext) { 

            _dbContext = dbContext;

        }


    }
}
