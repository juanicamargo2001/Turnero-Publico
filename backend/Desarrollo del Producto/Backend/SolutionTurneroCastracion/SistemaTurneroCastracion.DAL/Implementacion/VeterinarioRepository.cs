using Microsoft.EntityFrameworkCore;
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

        public async Task<List<Veterinario>> buscarPorDocumento(int dni)
        {
            try
            {
                string dniParceado = dni.ToString();

                List<Veterinario> veterinarios = await _dbContext.Veterinarios
                    .Where(v => v.Dni.ToString().Contains(dniParceado))
                    .ToListAsync();

                return veterinarios;
            }
            catch (Exception ex) { 
            
                throw new Exception(ex.ToString());
            }
        }
                      

    }

}

