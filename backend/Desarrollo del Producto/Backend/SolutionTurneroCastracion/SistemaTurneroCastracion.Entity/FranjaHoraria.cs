using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class FranjaHoraria
    {
        public int? IdFranjaHoraria { get; set; }

        public TimeSpan HorarioInicio { get; set; }

        public TimeSpan HorarioFin { get; set; }

        public int IdCentroCastracion { get; set; }

        public int Cantidad { get; set; }

        public bool EsTurnoTarde { get; set; }

        public int IdTipoTurno { get; set; }

        [JsonIgnore]
        public virtual TipoTurno? TipoTurno { get; set; }

        [JsonIgnore]
        public virtual CentroCastracion? Centro { get; set; }

    }
}
