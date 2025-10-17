using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class EmailPostOpResponseDTO
    {
        public string Nombre { get; set; }

        public string Email { get; set; }

        public string Sexo { get; set; }

    }
}
