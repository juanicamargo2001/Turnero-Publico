using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class MedicamentoRequestDTO
    {
        public required string Nombre { get; set; }

        public string? Descripcion { get; set; }

    }
}
