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
    public class MascotaRepository : GenericRepository<Mascota>, IMascotaRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public MascotaRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<MascotaDTO>> obtenerMascotasDueño()
        {
            using (var ctx = _dbContext)
            {
                var query = from m in ctx.Mascotas
                            join s in ctx.Sexos on m.IdSexo equals s.IdSexos
                            join t in ctx.Tamaños on m.IdTamaño equals t.IdTamaño
                            join ta in ctx.TiposAnimals on m.IdTipoAnimal equals ta.IdTipo
                            select new MascotaDTO
                            {
                                Edad = m.Edad,
                                Descripcion = m.Descripcion,
                                Nombre = m.Nombre,
                                Sexo = s.SexoTipo,
                                Tamaño = t.TamañoTipo,
                                TipoAnimal = ta.TipoAnimal,
                                Vecino = null //por ahora esto va null despues vemos pero creo que la relacion es al reves 
                            };
                return query.ToList();
            }
        }
    }
}
