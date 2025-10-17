using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface ICentroCastracionRepository : IGenericRepository<CentroCastracion>
    {
        Task<CentroCastracionDTO> obtenerCentroVeterinarios(int idCentro);
        Task<List<FranjaHoraria>> ObtenerFranjaHorariaXCentro(int idCentro);
        bool CrearFranjaHoraria(List<FranjaHoraria> franja);
        Task<bool> EliminarFranjaHoraria(int idFranja);
        Task<bool> EditarFranjaHoraria(FranjaHoraria franja);
    }
}
