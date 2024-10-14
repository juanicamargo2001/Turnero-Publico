using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Turnos
    {
        public int IdTurno { get; set; }

        public DateTime Dia { get; set; }

        public int? IdAgenda { get; set; }

        [JsonIgnore]
        public virtual Agenda Agenda { get; set; }

        [JsonIgnore]
        public ICollection<Horarios> Horarios { get; set; }

    }
}
