using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.BLL;
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
        public async Task<List<MedicacionPostOperatorioResponse>> ObtenerPostOperatorio(HttpContext context, int idHorario)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            List<MedicacionPostOperatorioResponse> medicacionPost = await (from MH in _dbContext.MedicacionxHorarios
                                                                     join Me in _dbContext.Medicacion on MH.IdMedicamento equals Me.IdMedicacion
                                                                     join U in _dbContext.UnidadMedidas on MH.IdUnidadMedida equals U.IdUnidad
                                                                     join H in _dbContext.Horarios on MH.IdHorario equals H.IdHorario
                                                                     join M in _dbContext.Mascotas on H.Id_mascota equals M.IdMascota
                                                                     join S in _dbContext.Sexos on M.IdSexo equals S.IdSexos
                                                                     where MH.IdHorario == idHorario && H.Id_Usuario == idUsuario
                                                               select new MedicacionPostOperatorioResponse
                                                               {
                                                                   Medicamento = Me.Nombre,
                                                                   Dosis = (float)Convert.ToDouble(MH.Dosis),
                                                                   UnidadMedida = U.TipoUnidad,
                                                                   Descripcion = MH.Descripcion,
                                                                   Sexo = S.SexoTipo
                                                               }).ToListAsync();

            return medicacionPost;

        }


    }
}
