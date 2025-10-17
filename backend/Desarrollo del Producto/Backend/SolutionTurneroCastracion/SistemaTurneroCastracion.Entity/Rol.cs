using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Rol
    {
        public int IdRol { get; set; }

        public string Nombre {  get; set; }

        [JsonIgnore]
        public virtual ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
    }
}
