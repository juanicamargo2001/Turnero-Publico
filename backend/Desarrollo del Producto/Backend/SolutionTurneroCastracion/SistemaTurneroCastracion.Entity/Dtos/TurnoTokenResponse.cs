using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class TurnoTokenResponse
    {
        public string Nombre { get; set; }

        public string CentroCastracion { get; set; }

        public string Fecha { get; set; }

        public string Hora { get; set; }

        public int IdHorario { get; set; }

        public int? IdUsuario { get; set; }
    }
}
