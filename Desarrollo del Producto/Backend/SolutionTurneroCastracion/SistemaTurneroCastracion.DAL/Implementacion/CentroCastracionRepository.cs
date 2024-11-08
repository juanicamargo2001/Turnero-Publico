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
    }
}
