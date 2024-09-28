using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Interfaces
{
    public interface IMascotaRepository : IGenericRepository<Mascota>
    {
        Task<List<MascotaDTO>> obtenerMascotasDueño();
        Task<MascotaDTO> obtenerMascotasDueñoById(int id);
        Task<bool> editarMascotaPorId(MascotaDTO mascotaEditar);
        Task<Mascota> crearMascota(MascotaDTO mascota);

    }
}
