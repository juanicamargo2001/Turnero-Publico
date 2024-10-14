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

            TimeSpan? inicio = centro.Inicio;
            TimeSpan? fin = centro.Fin;
            TimeSpan? horaActual = inicio;

            var horariosGenerados = new List<Horarios>();

            int? suma = centro.CantidadTurnosGato + centro.CantidadTurnosPerro;

            bool esTurnoGato = true;
            int iteracion = 0;

            while (horaActual < fin)
            {               
                if (esTurnoGato && centro.CantidadTurnosGato> 0)
                { 
                    horariosGenerados.Add(new Horarios
                    {
                        Hora = horaActual,
                        TipoTurno = 0,
                        IdTurno = centro.IdTurno,
                        Habilitado = true
                    });
                    centro.CantidadTurnosGato--;
                    iteracion++;
                }
                else if (!esTurnoGato && centro.CantidadTurnosPerro > 0)
                {
                    horariosGenerados.Add(new Horarios
                    {
                       Hora = horaActual,
                       TipoTurno = 1,
                       IdTurno = centro.IdTurno, 
                       Habilitado = true
                    });
                    centro.CantidadTurnosPerro--;
                    iteracion++;
                }

                if (centro.CantidadTurnosGato > 0 && centro.CantidadTurnosPerro > 0)
                {
                    esTurnoGato = !esTurnoGato;
                }

                else if (centro.CantidadTurnosGato == 0 && centro.CantidadTurnosPerro > 0)
                {
                    esTurnoGato = false;
                }
                else if (centro.CantidadTurnosPerro == 0 && centro.CantidadTurnosGato > 0)
                {
                    esTurnoGato = true;
                }

                if (suma == iteracion)
                {
                    break;
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
