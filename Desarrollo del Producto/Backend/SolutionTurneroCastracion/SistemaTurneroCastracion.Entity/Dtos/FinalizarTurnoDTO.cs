using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class FinalizarTurnoDTO
    {
        public int IdHorario { get; set; }

        public int IdLegajoVeterinario { get; set; }

        public List<MedicamentoxHorarioDTO>? Medicaciones { get; set; }


    }
}
