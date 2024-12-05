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
    public interface IMascotaRepository : IGenericRepository<Mascota>
    {
        Task<List<MascotaDTO>> obtenerTodasMascotas();
        Task<List<MascotaDTO>> obtenerMascotasDueño(HttpContext context);
        Task<bool> editarMascotaPorId(MascotaDTO mascotaEditar);
        Task<Mascota> CrearMascota(MascotaDTO mascota, HttpContext context);
        Task<Mascota> CrearMascota(MascotaDTO mascota, int? idUsuario);

    }
}
