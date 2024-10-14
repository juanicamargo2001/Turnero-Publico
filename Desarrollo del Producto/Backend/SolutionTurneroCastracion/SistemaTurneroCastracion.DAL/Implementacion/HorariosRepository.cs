using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
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


        public async Task<bool> crearHorarios(int idCentroCastracion, int idTurno, int? cantidadTurnosGato, int? cantidadTurnosPerro)
        {
            var centro = await _dbContext.Centros
                                  .Where(c => c.Id_centro_castracion == idCentroCastracion)
                                  .Select(c => new
                                  {
                                      c.HoraLaboralInicio,
                                      c.HoraLaboralFin
                                  })
                                  .FirstOrDefaultAsync();


            if (centro == null)
            {
                throw new Exception("Centro de castración no encontrado.");
            }

            TimeSpan? inicio = centro.HoraLaboralInicio;
            TimeSpan? fin = centro.HoraLaboralFin;
            TimeSpan? horaActual = inicio;

            var horariosGenerados = new List<Horarios>();

            int? suma = cantidadTurnosGato + cantidadTurnosPerro;
            bool esTurnoGato = true;

            while (horaActual < fin)
            {
                if (!(horaActual >= new TimeSpan(12, 0, 0) && horaActual < new TimeSpan(14, 0, 0)))
                {
                    if (esTurnoGato && cantidadTurnosGato > 0)
                    {
                        horariosGenerados.Add(new Horarios
                        {
                            Hora = horaActual,
                            TipoTurno = 0,
                            IdTurno = idTurno,
                            Habilitado = true
                        });
                        cantidadTurnosGato--;
                    }
                    else if (!esTurnoGato && cantidadTurnosPerro > 0)
                    {
                        horariosGenerados.Add(new Horarios
                        {
                            Hora = horaActual,
                            TipoTurno = 1,
                            IdTurno = idTurno, 
                            Habilitado = true
                        });
                        cantidadTurnosPerro--;
                    }

                    if (cantidadTurnosGato > 0 && cantidadTurnosPerro > 0)
                    {
                        esTurnoGato = !esTurnoGato;
                    }
                    if (cantidadTurnosPerro == 0 && cantidadTurnosGato == 0)
                    {
                        break;
                    }
                }
                horaActual = horaActual?.Add(new TimeSpan(0, 30, 0));
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


    }
}
