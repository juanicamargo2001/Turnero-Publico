using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Agenda
    {

        public int? IdAgenda { get; set; }

        public DateTime Fecha_inicio { get; set; }

        public DateTime? Fecha_fin { get; set; }
 
        public int? CantidadTurnosGatos { get; set; }
        
        public int? CantidadTurnosPerros { get; set; }

        public int? CantidadTurnosEmergencia { get; set; }

        public int IdCentroCastracion { get; set; }

        [JsonIgnore]
        public virtual CentroCastracion CentrosCastracion { get; set; }

        [JsonIgnore]
        public ICollection<Turnos>? Turnos { get; set; } = new List<Turnos>();

    }
}
