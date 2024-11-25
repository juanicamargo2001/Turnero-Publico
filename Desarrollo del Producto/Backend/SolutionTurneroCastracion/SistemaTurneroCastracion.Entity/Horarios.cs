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

        public int Id_Estado { get; set; }

        public int? Id_Legajo { get; set; }

        public int? Id_Usuario{ get; set; }

        public string? DescripPostOperatorio { get; set; }

        public byte[] RowVersion { get; set; }

        public int? Id_mascota { get; set; }


        [JsonIgnore]
        public Turnos Turnos { get; set; }

        [JsonIgnore]
        public Estado Estado {  get; set; }

        [JsonIgnore]
        public virtual TipoTurno? IdTipoTurnoNavigation { get; set; }


        [JsonIgnore]
        public virtual Veterinario? Veterinario { get; set; }


        [JsonIgnore]
        public virtual Usuario? Usuario { get; set; }

        [JsonIgnore]
        public virtual CorreosProgramados? CorreosProgramados { get; set;}

        [JsonIgnore]
        public virtual Mascota Mascota { get; set; }

    }
}
