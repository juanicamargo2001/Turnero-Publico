using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class Feriados
    {
        public int IdFeriado { get; set; }

        public DateTime Fecha { get; set; }

        public int Nombre { get; set; }

        public string Tipo { get; set; }

    }
}
