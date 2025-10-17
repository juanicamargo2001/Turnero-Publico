using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Vecino
    {
        public int? Id_vecino { get; set; }

	    public DateTime F_nacimiento {  get; set; }

        public string? Domicilio {  get; set; }

        public long Dni {  get; set; }

	    public long Telefono {  get; set; }

        public int? Id_usuario {  get; set; }

        [JsonIgnore]
        public ICollection<Mascota>? Mascotas { get; set; } = new List<Mascota>();

        [JsonIgnore]
        public virtual Usuario Usuario { get; set; }

        

    }
}
