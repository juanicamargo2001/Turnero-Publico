using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class HoraTurnoResponseDTO
    {
        public TimeSpan? Hora { get; set; }
        public string TipoTurno {  get; set; }

    }
}
