using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Medicacion
    {
        public int? IdMedicacion { get; set; }

        public required string Nombre { get; set; }

        public string? Descripcion { get; set; }

        [JsonIgnore]
        public virtual ICollection<MedicacionxHorario> MedicacionxHorario { get; set; } = [];


    }
}
