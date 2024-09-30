using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class MascotaRepository : GenericRepository<Mascota>, IMascotaRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public MascotaRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<MascotaDTO>> obtenerMascotasDueño()
        {
            using (var ctx = _dbContext)
            {
                var query = from m in ctx.Mascotas
                            join s in ctx.Sexos on m.IdSexo equals s.IdSexos
                            join t in ctx.Tamaños on m.IdTamaño equals t.IdTamaño
                            join ta in ctx.TiposAnimals on m.IdTipoAnimal equals ta.IdTipo
                            select new MascotaDTO
                            {
                                idMascota = m.IdMascota,
                                Edad = m.Edad,
                                Descripcion = m.Descripcion,
                                Nombre = m.Nombre,
                                Sexo = s.SexoTipo,
                                Tamaño = t.TamañoTipo,
                                TipoAnimal = ta.TipoAnimal,
                                Vecino = null //por ahora esto va null despues vemos pero creo que la relacion es al reves 
                            };
                return query.ToList();
            }
        }


        public async Task<MascotaDTO> obtenerMascotasDueñoById(int id)
        {
            using (var ctx = _dbContext)
            {
                var query = from m in ctx.Mascotas
                            join s in ctx.Sexos on m.IdSexo equals s.IdSexos
                            join t in ctx.Tamaños on m.IdTamaño equals t.IdTamaño
                            join ta in ctx.TiposAnimals on m.IdTipoAnimal equals ta.IdTipo
                            where m.IdMascota == id
                            select new MascotaDTO
                            {
                                idMascota = m.IdMascota,
                                Edad = m.Edad,
                                Descripcion = m.Descripcion,
                                Nombre = m.Nombre,
                                Sexo = s.SexoTipo,
                                Tamaño = t.TamañoTipo,
                                TipoAnimal = ta.TipoAnimal,
                                Vecino = null //por ahora esto va null despues vemos pero creo que la relacion es al reves 
                            };
                return query.FirstOrDefault();
            }
        }


        public async Task<bool> editarMascotaPorId(MascotaDTO mascotaEditar)
        {
            using (var ctx = _dbContext)
            {
                int sexoId = await ctx.Sexos
                    .Where(s => s.SexoTipo == mascotaEditar.Sexo)
                    .Select(s => s.IdSexos) 
                    .FirstOrDefaultAsync();


                int tamañoId = await ctx.Tamaños
                    .Where(t => t.TamañoTipo == mascotaEditar.Tamaño)
                    .Select(t => t.IdTamaño)
                    .FirstOrDefaultAsync();

                int tipoAnimalId = await ctx.TiposAnimals
                    .Where(ta => ta.TipoAnimal == mascotaEditar.TipoAnimal)
                    .Select(ta => ta.IdTipo)
                    .FirstOrDefaultAsync();

                if (sexoId == 0 || tamañoId == 0 || tipoAnimalId == 0) {
                    return false;
                }

                Mascota mascota = await ctx.Mascotas.FirstOrDefaultAsync(m => m.IdMascota == mascotaEditar.idMascota);

                if (mascota == null) {  return false; }

                mascota.IdSexo = sexoId;
                mascota.IdTamaño = tamañoId;
                mascota.IdTipoAnimal = tipoAnimalId;
                mascota.Nombre = mascotaEditar.Nombre;
                mascota.Descripcion = mascotaEditar.Descripcion;
                mascota.Edad = mascotaEditar.Edad;


                return await this.Editar(mascota);
            }
        }

        public async Task<Mascota> crearMascota(MascotaDTO mascota)
        {
            using (var ctx = _dbContext)
            {
                int sexoId = await ctx.Sexos
                    .Where(s => s.SexoTipo == mascota.Sexo)
                    .Select(s => s.IdSexos)
                    .FirstOrDefaultAsync();


                int tamañoId = await ctx.Tamaños
                    .Where(t => t.TamañoTipo == mascota.Tamaño)
                    .Select(t => t.IdTamaño)
                    .FirstOrDefaultAsync();

                int tipoAnimalId = await ctx.TiposAnimals
                    .Where(ta => ta.TipoAnimal == mascota.TipoAnimal)
                    .Select(ta => ta.IdTipo)
                    .FirstOrDefaultAsync();


                return await this.Crear(new Mascota
                {
                    Descripcion = mascota.Descripcion,
                    Edad = mascota.Edad,
                    IdTipoAnimal = tipoAnimalId,
                    IdSexo = sexoId,
                    IdTamaño = tamañoId,
                    IdVecino = mascota.Vecino,
                    Nombre = mascota.Nombre
                });

            }
        }

       


    }
}
