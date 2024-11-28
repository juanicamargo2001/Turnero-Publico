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
    public interface IHorariosRepository : IGenericRepository<Horarios>
    {
        Task<bool> crearHorarios(HorarioCentroParametroDTO centro);
        Task<bool> CambiarEstado(EstadoTurno estadoTurno, int id_Horario);
        Task<bool> SacarTurno(HorarioMascotaDTO horarioMascota, HttpContext httpContext);
        Task<bool> CancelarTurno(int idTurno, HttpContext context);
        Task<bool> ConfirmarTurno(int idHorario, HttpContext context);
        Task<List<TurnosFiltradoSecretariaDTO?>> ObtenerHorariosFiltrados(TurnosSecretariaDTO filtro, HttpContext context);
        Task<bool> EliminarHorarios(int idAgenda);
        Task<bool> ConfirmarIngreso(int idHorario);
    }
}
