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
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class MascotaRepository : GenericRepository<Mascota>, IMascotaRepository
    {
        protected readonly CentroCastracionContext _dbContext;
        private readonly IRazasRepository _razasRepository;

        public MascotaRepository(CentroCastracionContext dbContext, IRazasRepository razasRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _razasRepository = razasRepository;
        }

        //public async Task<List<MascotaDTO>> obtenerTodasMascotas()
        //{
        //    using (var ctx = _dbContext)
        //    {
        //        var query = from m in ctx.Mascotas
        //                    join s in ctx.Sexos on m.IdSexo equals s.IdSexos
        //                    join t in ctx.Tamaños on m.IdTamaño equals t.IdTamaño
        //                    join ta in ctx.TiposAnimals on m.IdTipoAnimal equals ta.IdTipo
        //                    join V in ctx.Vecinos on m.IdVecino equals V.Id_vecino
        //                    select new MascotaDTO
        //                    {
        //                        idMascota = m.IdMascota,
        //                        Edad = m.Edad,
        //                        Descripcion = m.Descripcion,
        //                        Nombre = m.Nombre,
        //                        Sexo = s.SexoTipo,
        //                        Tamaño = t.TamañoTipo,
        //                        TipoAnimal = ta.TipoAnimal,
        //                        Vecino = V.Id_vecino
        //                    };
        //        return query.ToList();
        //    }
        //}


        public async Task<List<MascotaDTO>> obtenerMascotasDueño(HttpContext? context = null, int? idUsuario = null)
        {
            idUsuario ??= context != null ? UtilidadesUsuario.ObtenerIdUsuario(context) : null;

            using (var ctx = _dbContext)
            {
                var mascotas = await (from M in ctx.Mascotas
                                      join V in _dbContext.Vecinos on M.IdVecino equals V.Id_vecino
                                      join U in _dbContext.Usuarios on V.Id_usuario equals U.IdUsuario
                                      join s in ctx.Sexos on M.IdSexo equals s.IdSexos
                                      join t in ctx.Tamaños on M.IdTamaño equals t.IdTamaño
                                      join ta in ctx.TiposAnimals on M.IdTipoAnimal equals ta.IdTipo
                                      join r in ctx.Razas on M.IdRaza equals r.IdRazas
                                      where U.IdUsuario == idUsuario && M.EstaCastrado == false
                                      select new MascotaDTO
                                      {
                                          idMascota = M.IdMascota,
                                          Edad = M.Edad,
                                          Descripcion = M.Descripcion,
                                          Nombre = M.Nombre,
                                          Sexo = s.SexoTipo,
                                          Tamaño = t.TamañoTipo,
                                          TipoAnimal = ta.TipoAnimal,
                                          Vecino = V.Id_vecino,
                                          Raza = r.Nombre
                                      }).ToListAsync();



                return mascotas;
            }
        }

        public async Task<List<MascotaDTO>> MisMascotas(HttpContext context)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            using (var ctx = _dbContext)
            {
                var mascotas = await (from M in ctx.Mascotas
                                      join V in _dbContext.Vecinos on M.IdVecino equals V.Id_vecino
                                      join U in _dbContext.Usuarios on V.Id_usuario equals U.IdUsuario
                                      join s in ctx.Sexos on M.IdSexo equals s.IdSexos
                                      join t in ctx.Tamaños on M.IdTamaño equals t.IdTamaño
                                      join ta in ctx.TiposAnimals on M.IdTipoAnimal equals ta.IdTipo
                                      join r in ctx.Razas on M.IdRaza equals r.IdRazas
                                      where U.IdUsuario == idUsuario
                                      select new MascotaDTO
                                      {
                                          idMascota = M.IdMascota,
                                          Edad = M.Edad,
                                          Descripcion = M.Descripcion,
                                          Nombre = M.Nombre,
                                          Sexo = s.SexoTipo,
                                          Tamaño = t.TamañoTipo,
                                          TipoAnimal = ta.TipoAnimal,
                                          Raza = r.Nombre
                                      }).ToListAsync();

                return mascotas;
            }
        }


        public async Task<bool> editarMascotaPorId(MascotaDTO mascotaEditar)
        {

            int sexoId = await _dbContext.Sexos
                .Where(s => s.SexoTipo == mascotaEditar.Sexo)
                .Select(s => s.IdSexos)
                .FirstOrDefaultAsync();


            int tamañoId = await _dbContext.Tamaños
                .Where(t => t.TamañoTipo == mascotaEditar.Tamaño)
                .Select(t => t.IdTamaño)
                .FirstOrDefaultAsync();

            int tipoAnimalId = await _dbContext.TiposAnimals
                .Where(ta => ta.TipoAnimal == mascotaEditar.TipoAnimal)
                .Select(ta => ta.IdTipo)
                .FirstOrDefaultAsync();

            int idRaza = await _dbContext.Razas
                .Where(r => r.Nombre == mascotaEditar.Raza)
                .Select(r => r.IdRazas)
                .FirstOrDefaultAsync();


            if (sexoId == 0 || tamañoId == 0 || tipoAnimalId == 0 || idRaza == 0) {
                return false;
            }

            Mascota? mascota = await _dbContext.Mascotas.FirstOrDefaultAsync(m => m.IdMascota == mascotaEditar.idMascota);

            if (mascota == null) { return false; }

            mascota.IdSexo = sexoId;
            mascota.IdTamaño = tamañoId;
            mascota.IdTipoAnimal = tipoAnimalId;
            mascota.Nombre = mascotaEditar.Nombre;
            mascota.Descripcion = mascotaEditar.Descripcion;
            mascota.Edad = mascotaEditar.Edad;
            mascota.IdRaza = idRaza;


            return await this.Editar(mascota);

        }

        private async Task<Mascota> CrearMascotaBD(MascotaDTO mascota, int? idVecino)
        {
            int sexoId = await _dbContext.Sexos
                .Where(s => s.SexoTipo == mascota.Sexo)
                .Select(s => s.IdSexos)
                .FirstOrDefaultAsync();


            int tamañoId = await _dbContext.Tamaños
                .Where(t => t.TamañoTipo == mascota.Tamaño)
                .Select(t => t.IdTamaño)
                .FirstOrDefaultAsync();

            int tipoAnimalId = await _dbContext.TiposAnimals
                .Where(ta => ta.TipoAnimal == mascota.TipoAnimal)
                .Select(ta => ta.IdTipo)
                .FirstOrDefaultAsync();

            int idRaza = await _dbContext.Razas
                .Where(r => r.Nombre == mascota.Raza)
                .Select(r => r.IdRazas)
                .FirstOrDefaultAsync();


            return await this.Crear(new Mascota
            {
                Descripcion = mascota.Descripcion,
                Edad = mascota.Edad,
                IdTipoAnimal = tipoAnimalId,
                IdSexo = sexoId,
                IdTamaño = tamañoId,
                IdVecino = idVecino,
                Nombre = mascota.Nombre,
                IdRaza = idRaza
            });

        }


        public async Task<int?> ObtenerIdVecino(int? idUsuario)
        {
            if (idUsuario != null)
            {
                int? idVecino = await (from U in _dbContext.Usuarios
                                       join V in _dbContext.Vecinos on U.IdUsuario equals V.Id_usuario
                                       where U.IdUsuario == idUsuario
                                       select V.Id_vecino).FirstOrDefaultAsync();

                return idVecino;
            }

            return null;

        }


        public async Task<Mascota> CrearMascota(MascotaDTO mascota, HttpContext context)
        {
            int? idUsuario = UtilidadesUsuario.ObtenerIdUsuario(context);

            int? idVecino = await ObtenerIdVecino(idUsuario);

            return await CrearMascotaBD(mascota, idVecino);

        }

        public async Task<Mascota> CrearMascota(MascotaDTO mascota, int? idUsuario)
        {
            int? idVecino = await ObtenerIdVecino(idUsuario);

            return await CrearMascotaBD(mascota, idVecino);

        }


        public async Task<bool> CambiarEstadoCastrado(int? idMascota)
        {

            Mascota? mascotaEditar = await Obtener(m => m.IdMascota == idMascota);

            if (mascotaEditar == null)
                return false;

            mascotaEditar.EstaCastrado = true;

            if (!await Editar(mascotaEditar))
                return false;

            return true;

        }


        public async Task<List<RazasDTO>?> ObtenerRazasAnimal(string tipoAnimal, string animalBuscar)
        {
            List<RazasDTO>? razas = await _razasRepository.ObtenerTodasPorTipoAnimal(tipoAnimal, animalBuscar);

            if (razas?.Count == 0)
            {
                return [];
            }

            return razas;
        }
    }
}
