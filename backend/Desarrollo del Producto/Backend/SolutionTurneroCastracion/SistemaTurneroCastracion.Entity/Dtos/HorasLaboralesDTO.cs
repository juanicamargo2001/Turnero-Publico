using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class HorasLaboralesDTO
    {
        public TimeSpan? HoraLaboralInicio { get; set; }
        public TimeSpan? HoraLaboralFin { get; set; }
    }
}
