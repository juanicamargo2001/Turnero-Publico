using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class UnidadMedida
    {
        public int IdUnidad { get; set; }

        public required string TipoUnidad { get; set; }

        [JsonIgnore]
        public virtual ICollection<MedicacionxHorario> MedicacionxHorarios { get; set; } = [];


    }
}
