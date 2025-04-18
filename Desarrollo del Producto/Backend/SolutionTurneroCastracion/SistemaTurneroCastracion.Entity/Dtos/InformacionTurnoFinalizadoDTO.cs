using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class InformacionTurnoFinalizadoDTO
    {
        public string NombreVeterinario { get; set; }

        public string Matricula { get; set; }

        public List<MedicamentoxHorarioDTO>? Medicaciones { get; set; }

        public string? Observacion { get; set; }
    }
}
