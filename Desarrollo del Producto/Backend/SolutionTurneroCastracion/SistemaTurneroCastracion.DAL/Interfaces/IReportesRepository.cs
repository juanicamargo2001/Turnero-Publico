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
        Task<ResponseInformeAnimales?> ObtenerCantidadesTiposAnimales(FechasReporteRequest request);
        Task<ResponseInformeCancelacion?> ObtenerCantidadCancelaciones(FechasReporteRequest request);
        Task<List<ResponseInformeRazas>?> ObtenerCantidadRazaCastrados(FechasReporteRequest request, string tipoAnimal);

    }
}
