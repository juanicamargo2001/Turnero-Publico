using Azure.Core;
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
    public class UnidadMedidaRepository : GenericRepository<UnidadMedida> , IUnidadMedidaRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public UnidadMedidaRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<bool> CrearUnidad(string unidad)
        {
            if (await Crear(new UnidadMedida { TipoUnidad = unidad }) == null)
                return false;
            return true;
        }



    }
}
