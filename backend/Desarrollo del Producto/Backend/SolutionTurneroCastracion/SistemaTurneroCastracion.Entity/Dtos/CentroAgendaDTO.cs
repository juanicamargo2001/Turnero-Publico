using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class CentroAgendaDTO
    {
        public int IdCentro { get; set; }

        //public int? CantidadTurnosGatos { get; set; }

        //public int? CantidadTurnosPerros { get; set; }

        //public int? CantidadTurnosEmergencia { get; set; }

        public List<FranjaHorariasDTO> franjasHorarias { get; set; }

    }
}
