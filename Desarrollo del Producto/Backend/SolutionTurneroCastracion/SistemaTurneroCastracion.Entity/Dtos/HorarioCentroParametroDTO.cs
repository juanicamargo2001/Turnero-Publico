using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class HorarioCentroParametroDTO
    {
        public int IdCentroCastracion {  get; set; }

        public int IdTurno {  get; set; }

        public int? CantidadTurnosGato  { get; set; }

        public int? CantidadTurnosPerro { get; set; }

        public TimeSpan? Inicio { get; set; }

        public TimeSpan? Fin { get; set; }

    }
}
