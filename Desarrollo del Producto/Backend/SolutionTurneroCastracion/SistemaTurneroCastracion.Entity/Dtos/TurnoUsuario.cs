using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class TurnoUsuario
    {
        public int IdHorario { get; set; }

        public TimeSpan? Hora { get; set; }

        public string TipoTurno { get; set; }

        public DateTime DiaTurno { get; set; }

        public string Estado { get; set; }

        public string DescripPostOperatorio { get; set; }


    }
}
