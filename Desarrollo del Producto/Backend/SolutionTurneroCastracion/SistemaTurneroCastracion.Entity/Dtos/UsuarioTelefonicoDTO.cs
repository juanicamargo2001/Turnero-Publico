using SistemaTurneroCastracion.Entity.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class UsuarioTelefonicoDTO
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        [MinAge(18)]
        public DateTime F_Nacimiento { get; set; }

        [Dni]
        public long DNI { get; set; }

        public string Email { get; set; }

        public long Telefono { get; set; }


    }
}
