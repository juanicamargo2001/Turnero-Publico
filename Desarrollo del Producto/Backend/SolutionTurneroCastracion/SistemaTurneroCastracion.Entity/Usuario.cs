using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Usuario
    {
        public int IdUsuario { get; set; }

        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public string? Contraseña { get; set; }

        public string Email { get; set; }

        public int? RolId { get; set; }

        [JsonIgnore]
        public virtual Rol? Rol {  get; set; }

        [JsonIgnore]
        public virtual Vecino? Vecino { get; set; }

        [JsonIgnore]
        public virtual ICollection<HistorialRefreshToken> HistorialRefreshTokens { get; } = new List<HistorialRefreshToken>();

        [JsonIgnore]
        public virtual ICollection<Horarios> Horarios { get; set; } = new List<Horarios>();

        [JsonIgnore]
        public ICollection<SecretariaxCentro>? SecretariaxCentros { get; set; } = [];

    }
}
