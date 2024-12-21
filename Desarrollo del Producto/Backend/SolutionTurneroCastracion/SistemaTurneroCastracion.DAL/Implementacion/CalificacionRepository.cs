using Microsoft.AspNetCore.Http;
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
    public class CalificacionRepository : GenericRepository<Calificacion>, ICalificacionRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public CalificacionRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> CrearCalificacion(RequestCalificacion request, HttpContext context)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            Calificacion? calificacionCreada = await Crear(new Calificacion
            {
                NumeroCalifacion = request.NumeroCalifacion,
                Descripcion = request.Descripcion,
                IdCentroCastracion = request.IdCentroCastracion,
                IdUsuario = idUsuario!.Value
            });

            if (calificacionCreada == null)
                return false;

            return true;

        }

        public async Task<List<ResponseCalificacion?>> ObtenerCalificacionesXCentro(int idCentro)
        {
            List<ResponseCalificacion?> calificaciones = await (from CA in _dbContext.Calificacions
                                                                join CC in _dbContext.Centros on CA.IdCentroCastracion equals CC.Id_centro_castracion
                                                                join U in _dbContext.Usuarios on CA.IdUsuario equals U.IdUsuario
                                                                where CC.Id_centro_castracion == idCentro
                                                                select new ResponseCalificacion
                                                                {
                                                                    IdCalificacion = CA.IdCalificacion,
                                                                    Nombre = U.Nombre,
                                                                    Apellido = U.Apellido,
                                                                    NumeroCalificacion = CA.NumeroCalifacion,
                                                                    Descripcion = CA.Descripcion,
                                                                    CentroCastracion = CC.Nombre
                                                                }).ToListAsync();

            return calificaciones;

        }




    }
}
