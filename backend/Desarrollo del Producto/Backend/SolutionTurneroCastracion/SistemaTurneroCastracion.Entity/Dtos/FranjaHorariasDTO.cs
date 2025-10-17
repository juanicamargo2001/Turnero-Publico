using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class FranjaHorariasDTO
    {
        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HorarioFin { get; set; }

        public int IdTipoTurno { get; set; }

        public int Cantidad { get; set; }
    }
}
