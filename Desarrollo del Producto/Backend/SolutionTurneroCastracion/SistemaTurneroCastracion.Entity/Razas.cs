using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Razas
    {
        public int IdRazas { get; set; }

        public string Nombre { get; set; }

        public int IdTipoAnimal {  get; set; }

        public virtual ICollection<Mascota> Mascotas { get; set; } = [];

        public virtual TiposAnimal TiposAnimal { get; set; }

    }
}
