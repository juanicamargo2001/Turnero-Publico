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
    public class MedicamentoxHorarioRepository : GenericRepository<MedicacionxHorario>, IMedicamentoxhorarioRepository
    {
        protected readonly CentroCastracionContext _dbContext;
        private readonly IUnidadMedidaRepository _unidadMedidaRepository;
        private readonly IMedicamentoRepository _medicamentoRepository;


        public MedicamentoxHorarioRepository(CentroCastracionContext dbContext, IUnidadMedidaRepository unidadMedidaRepository, 
                                             IMedicamentoRepository medicamentoRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _unidadMedidaRepository = unidadMedidaRepository;
            _medicamentoRepository = medicamentoRepository;
            
        }

        public async Task<bool> CrearMedicacionXHorario(List<MedicamentoxHorarioDTO>? medicamentoxHorarios, int idHorario) 
        {
            if (medicamentoxHorarios == null)
                return false;

            List<MedicacionxHorario> medicacionesGuardar = [];

            foreach(MedicamentoxHorarioDTO medicamentos in medicamentoxHorarios) 
            {
                medicacionesGuardar.Add(new MedicacionxHorario()
                {
                    IdHorario = idHorario,
                    IdMedicamento = (await _medicamentoRepository.Obtener(m => m.Nombre == medicamentos.Medicamento)).IdMedicacion,
                    Dosis = medicamentos.Dosis,
                    IdUnidadMedida = (await _unidadMedidaRepository.Obtener(um => um.TipoUnidad == medicamentos.UnidadMedida)).IdUnidad,
                    Descripcion = medicamentos.Descripcion
                });
            }

            try
            {
                await _dbContext.AddRangeAsync(medicacionesGuardar);

                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch (Exception ex) {
                
                Console.WriteLine(ex.ToString());
                
                return false;
                
            }
        
        }

    }
}
