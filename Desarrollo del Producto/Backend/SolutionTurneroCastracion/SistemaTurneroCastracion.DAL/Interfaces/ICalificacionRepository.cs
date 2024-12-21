using Microsoft.AspNetCore.Http;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface ICalificacionRepository : IGenericRepository<Calificacion>
    {
        Task<List<ResponseCalificacion?>> ObtenerCalificacionesXCentro(int idCentro);
        Task<bool> CrearCalificacion(RequestCalificacion request, HttpContext context);
    }
}
