using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class FinalizarTurnoFallidoRequest
    {
        public int IdHorario { get; set; }

        public int IdLegajoVeterinario { get; set; }

        public string? Observacion { get; set; }

    }
}
