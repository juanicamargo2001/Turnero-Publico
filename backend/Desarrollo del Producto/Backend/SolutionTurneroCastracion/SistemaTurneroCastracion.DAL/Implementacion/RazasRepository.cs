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
    public class RazasRepository : GenericRepository<Razas>, IRazasRepository
    {
        protected readonly CentroCastracionContext _dbContext;
        private readonly ITipoAnimalRepository _tipoAnimalRepository;

        public RazasRepository(CentroCastracionContext dbContext, ITipoAnimalRepository tipoAnimalRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _tipoAnimalRepository = tipoAnimalRepository;
        }

        public async Task<List<RazasDTO>?> ObtenerTodasPorTipoAnimal(string tipoRaza, string animalBusqueda)
        {
            int? idTipoAnimal = _tipoAnimalRepository.Consultar(t => t.TipoAnimal == tipoRaza).Result.FirstOrDefault()?.IdTipo;

            List<RazasDTO>? razasDTO = [.. Consultar(r => r.IdTipoAnimal == idTipoAnimal && r.Nombre.Contains(animalBusqueda)).Result
                                           .Select(r => new RazasDTO {NombreRaza = r.Nombre, IdRaza = r.IdRazas})];

            if (razasDTO.Count == 0)
                return null;

            return razasDTO;

        }

    }
}
