using Microsoft.Data.SqlClient;
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

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class CentroCastracionRepository : GenericRepository<CentroCastracion>, ICentroCastracionRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public CentroCastracionRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }


        
        public async Task<CentroCastracionDTO> obtenerCentroVeterinarios(int idCentro)
        {
            using (var ctx = _dbContext)
            {
                var centroCastracion = ctx.Centros
                .Where(c => c.Id_centro_castracion == idCentro)
                .Select(c => new CentroCastracionDTO
                {
                    Nombre = c.Nombre,
                    Barrio = c.Barrio,
                    Calle = c.Calle,
                    Altura = c.Altura,
                    Habilitado = c.Habilitado,
                    Veterinarios = ctx.VeterinarioxCentros
                    .Where(vc => vc.Id_centro_castracion == c.Id_centro_castracion)
                    .Join(ctx.Veterinarios,
                      vc => vc.Id_legajo,
                      v => v.IdLegajo,
                      (vc, v) => new Veterinario
                      {
                          IdLegajo = v.IdLegajo,
                          Matricula = v.Matricula,
                          Nombre = v.Nombre,
                          Telefono = v.Telefono,
                          Habilitado = v.Habilitado,
                          FNacimiento = v.FNacimiento,
                          Domicilio = v.Domicilio,
                          Dni = v.Dni,
                          Email = v.Email,
                          Apellido = v.Apellido,
                      })
                    .ToList()
                }).FirstOrDefault();

                return centroCastracion;
            }
        }

        public async Task<List<FranjaHoraria>> ObtenerFranjaHorariaXCentro(int idCentro)
        {
            List<FranjaHoraria> franjasHorariasFiltradas = await (from FH in _dbContext.FranjaHorarias
                                                                  join C in _dbContext.Centros on FH.IdCentroCastracion equals C.Id_centro_castracion
                                                                  where FH.IdCentroCastracion == idCentro
                                                                  orderby FH.HorarioInicio ascending
                                                                  select FH).ToListAsync();
            
            if (franjasHorariasFiltradas.Count > 0)
            {
                return franjasHorariasFiltradas;
            }

            return [];

        }


        public bool CrearFranjaHoraria(List<FranjaHoraria> franja)
        {
            try
            {
                if (franja.Count > 0)
                {
                    _dbContext.AddRange(franja);
                    _dbContext.SaveChanges();

                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return false;
            }
        }

        public async Task<bool> EliminarFranjaHoraria(int idFranja)
        {
            try
            {
                FranjaHoraria? franjaPorId = _dbContext.FranjaHorarias.Where(FH => FH.IdFranjaHoraria == idFranja).FirstOrDefault();

                if (franjaPorId != null)
                {
                    _dbContext.Remove(franjaPorId);
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
                            

                return false;
            }
            catch
            {
                return false;
            }
        }


        public async Task<bool> EditarFranjaHoraria(FranjaHoraria franja)
        {
            try
            {
                _dbContext.Update(franja);
                await _dbContext.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
