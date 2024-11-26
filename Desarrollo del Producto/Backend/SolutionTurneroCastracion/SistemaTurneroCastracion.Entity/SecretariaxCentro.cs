using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public class SecretariaxCentro
    {
        public int IdUsuario { get; set; }

        public int IdCentroCastracion { get; set; }


        [JsonIgnore]

        public virtual Usuario Secretaria { get; set; }

        [JsonIgnore]
        public virtual CentroCastracion CentroCastracion { get; set;}


    }
}
