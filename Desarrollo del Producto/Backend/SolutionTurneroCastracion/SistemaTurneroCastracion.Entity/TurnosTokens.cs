using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class TurnosTokens
    {
        public int IdTurnoToken { get; set; }

        public int IdHorario { get; set; }

        public int? IdUsuario { get; set; }

        public required string Token { get; set; }

        public DateTime FechaExpiracion { get; set; }

        public bool Usado { get; set; }

        
        public virtual Usuario? Usuario { get; set; }

        public virtual Horarios? Horario { get; set; }  

    }
}
