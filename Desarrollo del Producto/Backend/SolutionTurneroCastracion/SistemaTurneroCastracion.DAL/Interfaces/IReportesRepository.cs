using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IReportesRepository
    {
        Task<ResponseInformeAnimales?> ObtenerCantidadesTiposAnimales();
        Task<ResponseInformeCancelacion?> ObtenerCantidadCancelaciones();


    }
}
