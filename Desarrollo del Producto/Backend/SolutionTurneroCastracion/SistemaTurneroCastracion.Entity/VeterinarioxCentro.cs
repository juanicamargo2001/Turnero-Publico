using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace SistemaTurneroCastracion.Entity
{
    public partial class VeterinarioxCentro
    {
        public int Id_legajo { get; set; }

        [JsonIgnore]
        public Veterinario? Veterinario { get; set; }

        public int Id_centro_castracion { get; set; }

        [JsonIgnore]
        public CentroCastracion? CentroCastracion { get; set; }

    }
}
