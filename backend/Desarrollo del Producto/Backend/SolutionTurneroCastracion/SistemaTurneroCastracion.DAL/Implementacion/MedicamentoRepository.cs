using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class MedicamentoRepository : GenericRepository<Medicacion>, IMedicamentoRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public MedicamentoRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<bool> CrearMedicamento(MedicamentoRequestDTO request)
        {
            if (await Crear(new Medicacion { Nombre = request.Nombre, Descripcion = request.Descripcion }) == null)
                return false;

            return true;
        }




    }
}
