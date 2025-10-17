using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class CancelacionRequestDTO
    {
        public int IdHorario { get; set; }

        public int? IdUsuario { get; set; }

    }
}
