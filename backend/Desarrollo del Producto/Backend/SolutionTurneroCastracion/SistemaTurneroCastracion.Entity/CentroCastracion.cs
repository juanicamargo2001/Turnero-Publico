using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class CentroCastracion
    {
        public int Id_centro_castracion { get; set; }

        public string Nombre {  get; set; }

        public string Barrio { get; set; }

        public string Calle {  get; set; }

        public int Altura { get; set; }

        public bool Habilitado { get; set; }

        public TimeSpan? HoraLaboralInicio { get; set; }

        public TimeSpan? HoraLaboralFin {  get; set; }


        [JsonIgnore]
        public ICollection<VeterinarioxCentro>? VeterinarioxCentros { get; set; } = new List<VeterinarioxCentro>();

        [JsonIgnore]
        public ICollection<Agenda>? Agendas { get; set; } = new List<Agenda>();

        [JsonIgnore]
        public ICollection<SecretariaxCentro>? SecretariaxCentros { get; set; } = [];

        [JsonIgnore]
        public virtual ICollection<Calificacion> Calificaciones { get; set; } = [];

        [JsonIgnore]
        public virtual ICollection<FranjaHoraria> FranjaHorarias { get; set; } = [];
    }
}
