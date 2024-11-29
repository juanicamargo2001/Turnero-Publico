using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class HorariosCanceladosResponse
    {
        public int IdHorario { get; set; }

        public DateTime Dia { get; set; }

        public TimeSpan? Hora { get; set; }

        public string Estado { get; set; }


    }
}
