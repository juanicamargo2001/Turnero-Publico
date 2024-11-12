using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class HorariosRepository : GenericRepository<Horarios> , IHorariosRepository
    {
        protected readonly CentroCastracionContext _dbContext;
        private readonly ICentroCastracionRepository _centroCastracionRepository;

        public HorariosRepository(CentroCastracionContext dbContext, ICentroCastracionRepository centroCastracionRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _centroCastracionRepository = centroCastracionRepository;
        }


        public async Task<bool> crearHorarios(HorarioCentroParametroDTO centro)
        {

            TimeSpan? inicio = centro.InicioTrabajo;
            TimeSpan? fin = centro.FinTrabajo;
            TimeSpan? horaActual = inicio;

            var horariosGenerados = new List<Horarios>();

            int iteracion = 0;

            if (centro.HoraInicio >= inicio && centro.HoraFin < fin)
            {
                int estadoLibre = this.BuscarEstado(EstadoTurno.Libre.ToString());

                while (iteracion < centro.Cantidad)
                {
                    horariosGenerados.Add(new Horarios
                    {
                        Hora = centro.HoraInicio,
                        IdTurno = centro.IdTurno,
                        TipoTurno = centro.IdTipoTurno,
                        Id_Estado = estadoLibre
                    });

                    iteracion++;

                    if (centro.Cantidad == iteracion)
                    {
                        break;
                    }

                }
            }
            try
            {
                _dbContext.Horarios.AddRange(horariosGenerados);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }


        public async Task<bool> CambiarEstado (EstadoTurno estadoTurno, int id_Horario)
        {
            int id_estado = this.BuscarEstado(estadoTurno.ToString());

            Horarios horarioEncontrado = await this.Obtener(h => h.IdHorario == id_Horario);

            if (horarioEncontrado == null) 
            {
                return false;
            }

            horarioEncontrado.Id_Estado = id_estado;

            bool editado = await this.Editar(horarioEncontrado);

            if (!editado) { 
            
                return false;
            }

            return true;

        }

        

        private int BuscarEstado(string nombreEstado)
        {
            int id_estado = (from E in _dbContext.Estados
                            where E.Nombre == nombreEstado
                            select E.IdEstado)
                            .FirstOrDefault();

            return id_estado;
        }


        public async Task<bool> SacarTurno(int IdTurnoHorario, HttpContext httpContext)
        {
            var identity = httpContext.User.Identity as ClaimsIdentity;

            var idClaim = identity.Claims.FirstOrDefault(x => x.Type == "id");

            string idString = idClaim.Value;
            Console.WriteLine("ID: " + idString);
            int id;

            if (int.TryParse(idString, out id)) ;
            else
            {
                Console.WriteLine("El id no es un número válido.");
            }

            bool ocupado = this.EstaOcupado(IdTurnoHorario);

            if (!ocupado)
            {
                bool cambiadoEstado = await this.CambiarEstado(EstadoTurno.Reservado, IdTurnoHorario);

                if (!cambiadoEstado)
                {
                    return false;
                }

                Horarios? horarioEntrado = _dbContext.Horarios.Where(h => h.IdHorario == IdTurnoHorario).FirstOrDefault();

                if (horarioEntrado == null)
                {
                    return false;
                }

                horarioEntrado.Id_Usuario = id;

                bool reservado = await this.Editar(horarioEntrado);

                if (!reservado)
                {

                    return false;
                }

                return true;
            }
            else { return false; }
        }

        public bool EstaOcupado(int IdTurnoHorario)
        {
            string? nombreEstado = (from E in _dbContext.Estados
                                join H in _dbContext.Horarios on E.IdEstado equals H.Id_Estado
                                where H.IdHorario == IdTurnoHorario
                                select E.Nombre)
                                .FirstOrDefault();

            if (nombreEstado != EstadoTurno.Libre.ToString())
            {
                return true;
            }

            return false;

        }

        public async Task<bool> CancelarTurno(int idTurno, HttpContext context)
        {
            var identity = context.User.Identity as ClaimsIdentity;

            var idClaim = identity.Claims.FirstOrDefault(x => x.Type == "id");

            int? id = Int32.Parse(idClaim.Value);



            bool cambioCancelado = await this.CambiarEstado(EstadoTurno.Libre, idTurno);

            if (!cambioCancelado)
            {
                return false;
            }

            Horarios? cancelarUsuario= _dbContext.Horarios.Where(h => h.IdHorario == idTurno).FirstOrDefault();

            if (cancelarUsuario == null)
            {
                return false;
            }

            cancelarUsuario.Id_Usuario = null;

            bool cancelado = await this.Editar(cancelarUsuario);

            if (!cancelado)
            {

                return false;
            }

            return true;


        }


    }
}
