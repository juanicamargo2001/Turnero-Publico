using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class CancelacionMasivaDTO
    {
        public string Nombre { get; set; }

        public DateTime Dia { get; set; }

        public TimeSpan Hora { get; set; }

        public string Motivo { get; set; }

        public string Email { get; set; }

        public Horarios? Horario { get; set; }
    }


}
