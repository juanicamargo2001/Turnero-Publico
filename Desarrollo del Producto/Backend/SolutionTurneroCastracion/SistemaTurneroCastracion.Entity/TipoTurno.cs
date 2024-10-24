using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class TipoTurno
    {
        public int TipoId { get; set; }
        public string NombreTipo { get; set; }

        [JsonIgnore]
        public virtual ICollection<Horarios> Horarios { get; set; } = new List<Horarios>();

    }
}
