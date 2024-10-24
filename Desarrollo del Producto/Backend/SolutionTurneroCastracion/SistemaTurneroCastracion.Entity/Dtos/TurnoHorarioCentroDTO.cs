using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class TurnoHorarioCentroDTO
    {
        public List<DateTime> TurnosAgenda { get; set; }

        public int? IdAgenda { get; set; }
            
        public int IdCentroCastracion { get; set; }

        public List<FranjaHorariasDTO> FranjasHorarias { get; set; }

        //public int? CantidadTurnosGato { get; set; }

        //public int? CantidadTurnosPerros { get; set; }

        public TimeSpan? Inicio { get; set; }

        public TimeSpan? Fin { get; set; }


    }
}
