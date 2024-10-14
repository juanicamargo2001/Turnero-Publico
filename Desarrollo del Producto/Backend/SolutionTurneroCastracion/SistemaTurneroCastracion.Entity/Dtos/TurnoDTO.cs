using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class TurnoDTO
    {
        public DateTime Dia { get; set; }
        public List<Horarios> Hora { get; set; }
    }
}
