using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Horarios
    {
        public int IdHorario { get; set; }

        public TimeSpan? Hora { get; set; }

        public int? TipoTurno { get; set; }

        public int? IdTurno { get; set; }

        public bool? Habilitado { get; set; }

        [JsonIgnore]
        public Turnos Turnos { get; set; }

    }
}
