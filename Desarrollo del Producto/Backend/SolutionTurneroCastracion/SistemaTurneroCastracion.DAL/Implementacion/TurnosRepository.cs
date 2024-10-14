using Microsoft.EntityFrameworkCore.Query.Internal;
using Microsoft.IdentityModel.Tokens;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class TurnosRepository : GenericRepository<Turnos>, ITurnosRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        private readonly IHorariosRepository _horariosRepository;


        public TurnosRepository(CentroCastracionContext dbContext, IHorariosRepository horariosRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _horariosRepository = horariosRepository;
        }


        public async Task<bool> CrearTurnosAgenda(TurnoHorarioCentroDTO turnoHorarioDTO)
        {
            List<Turnos> turnoNuevo = new List<Turnos>();

            int mes = turnoHorarioDTO.TurnosAgenda[0].Month;

            List<DateTime> turnosFiltrados = turnoHorarioDTO.TurnosAgenda.Where(fecha => fecha.Month != mes).ToList();


            foreach (var turno in turnosFiltrados)
            {
                turnoNuevo.Add( new Turnos
                {
                    Dia = turno,
                    IdAgenda = turnoHorarioDTO.IdAgenda
                });
            }

            try
            {
                _dbContext.Turnos.AddRange(turnoNuevo);
                _dbContext.SaveChanges();

                for (int i = 0; i < turnosFiltrados.Count; i++) {
                
                    await _horariosRepository.crearHorarios(new HorarioCentroParametroDTO { 
                                                                IdCentroCastracion = turnoHorarioDTO.IdCentroCastracion, 
                                                                IdTurno = turnoNuevo[i].IdTurno, 
                                                                CantidadTurnosGato = turnoHorarioDTO.CantidadTurnosGato, 
                                                                CantidadTurnosPerro = turnoHorarioDTO.CantidadTurnosPerros,
                                                                Inicio = turnoHorarioDTO.Inicio,
                                                                Fin = turnoHorarioDTO.Fin
                    });
                }

            }
            catch (Exception ex)
            { 
                Console.WriteLine(ex.Message);

                return false;
            }
            return true;
        }

        public async Task<List<TurnoDTO>> ObtenerTurnosHabiles(int IdCentroCastracion, DateTime dia)
        {
            var turnos = (from C in _dbContext.Centros
                                join A in _dbContext.Agenda on C.Id_centro_castracion equals A.IdCentroCastracion
                                join T in _dbContext.Turnos on A.IdAgenda equals T.IdAgenda
                                join H in _dbContext.Horarios on T.IdTurno equals H.IdTurno
                                where C.Id_centro_castracion == IdCentroCastracion && T.Dia == dia
                                group H by new { T.Dia } into g
                                select new TurnoDTO
                                {
                                    Dia = g.Key.Dia,
                                    Hora = g.ToList()
                                }).ToList();

            return turnos;
        }

        public async Task<List<DateTime>> ObtenerDiasTurnos(int IdCentroCastracion)
        {
            var turnosDias = (from C in _dbContext.Centros
                             join A in _dbContext.Agenda on C.Id_centro_castracion equals A.IdCentroCastracion
                             join T in _dbContext.Turnos on A.IdAgenda equals T.IdAgenda
                             join H in _dbContext.Horarios on T.IdTurno equals H.IdTurno
                             where C.Id_centro_castracion == IdCentroCastracion
                             select T.Dia
                             ).Distinct().ToList();   
            return turnosDias;
        }

    }

}
