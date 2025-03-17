using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Calificacion
    {
        public int IdCalificacion { get; set; }

        public int NumeroCalifacion { get; set; }

        public string? Descripcion { get; set; }

        public int IdCentroCastracion { get; set; }

        public int IdUsuario { get; set; }

        public string Token {  get; set; }

        [JsonIgnore]
        public virtual Usuario Usuario { get; set; }

        [JsonIgnore]
        public virtual CentroCastracion CentroCastracion { get; set; }


    }
}
