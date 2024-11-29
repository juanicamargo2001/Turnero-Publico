using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface ICorreosProgramados : IGenericRepository<CorreosProgramados>
    {
        Task<bool> GuardarCorreo(EmailDTO datosEmail, int id_horario);
        Task<bool> BorrarCorreo(int idHorario);

    }
}
