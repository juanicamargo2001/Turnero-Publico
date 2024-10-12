using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class AgendaDTO
    {
        public DateTime FechaInicio { get; set; }

        public List<CentroAgendaDTO> CentroCastraciones{ get; set; }

        public int? IdTurno { get; set; }

    }
}
