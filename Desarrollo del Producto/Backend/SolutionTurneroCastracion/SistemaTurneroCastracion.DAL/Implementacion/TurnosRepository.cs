using Microsoft.IdentityModel.Tokens;
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
    public class TurnosRepository : GenericRepository<Turnos>, ITurnosRepository
    {
        protected readonly CentroCastracionContext _dbContext;


        public TurnosRepository(CentroCastracionContext dbContext) : base(dbContext)
        {

            _dbContext = dbContext;

        }


        public async Task<bool> CrearTurnosAgenda(List<DateTime> turnosAgenda, int? IdAgenda)
        {
            List<Turnos> turnoNuevo = new List<Turnos>();

            int mes = turnosAgenda[0].Month;

            List<DateTime> turnosFiltrados = turnosAgenda.Where(fecha => fecha.Month != mes).ToList();


            foreach (var turno in turnosFiltrados)
            {
                turnoNuevo.Add( new Turnos
                {
                    Dia = turno,
                    Hora = null,
                    IdAgenda = IdAgenda
                });
            }
            try
            {
                _dbContext.Turnos.AddRange(turnoNuevo);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            { 
                Console.WriteLine(ex.Message);

                return false;
            }
            return true;
        }

        public async Task<List<TurnoDTO>> ObtenerTurnosHabiles(int IdCentroCastracion)
        {
            var turnos = (from C in _dbContext.Centros
                                join A in _dbContext.Agenda on C.Id_centro_castracion equals A.IdCentroCastracion
                                join T in _dbContext.Turnos on A.IdAgenda equals T.IdAgenda
                                where C.Id_centro_castracion == IdCentroCastracion
                                select new TurnoDTO
                                {
                                    Dia = T.Dia,
                                    Hora = T.Hora
                                }).ToList();

            return turnos;
        }
    }

}
