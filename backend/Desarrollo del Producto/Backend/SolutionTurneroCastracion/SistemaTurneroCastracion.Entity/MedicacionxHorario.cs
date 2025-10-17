using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class MedicacionxHorario
    {
        public int IdHorario { get; set; }

        public int? IdMedicamento { get; set; }

        public float Dosis { get; set; }

        public int IdUnidadMedida {  get; set; }

        public string? Descripcion { get; set; }

        [JsonIgnore]
        public virtual Horarios Horario { get; set; }

        [JsonIgnore]
        public virtual Medicacion Medicamento { get; set; }

        [JsonIgnore]
        public virtual UnidadMedida UnidadMedida { get; set; }



    }
}
