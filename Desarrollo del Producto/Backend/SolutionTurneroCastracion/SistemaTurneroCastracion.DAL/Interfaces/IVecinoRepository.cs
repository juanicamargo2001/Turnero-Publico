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
    public interface IVecinoRepository : IGenericRepository<Vecino>
    {
        Task<bool> AnalizarDNIConReglas (string imageBytes);
        Task<bool> RegistrarSinFoto(ImagenRequest request);
        VecinoDTO? ConsultarVecinoXDniOPerfil(long? dni, HttpContext context);
        Task<bool> CrearVecinoTelefonico(UsuarioTelefonicoDTO request);

    }
}
