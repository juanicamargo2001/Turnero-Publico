using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class VeterinarioRepository : GenericRepository<Veterinario>, IVeterinarioRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public VeterinarioRepository(CentroCastracionContext dbContext) : base(dbContext) { 
        
            _dbContext = dbContext;
        }

        public async Task<Veterinario> buscarPorDocumento(int dni)
        {

            try
            {
                Veterinario veterinario = (Veterinario)await this.Consultar(v => v.Dni == dni);


                return veterinario;
            }
            catch (Exception ex) { 
            
                throw new Exception(ex.ToString());
            }
        }
                      

    }

}

