using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class ResponseCalificacion
    {
        public int IdCalificacion { get; set; }

        public string Nombre { get; set; }
        
        public string Apellido { get; set; }

        public int NumeroCalificacion { get; set; }

        public string? Descripcion { get; set; }

        public string CentroCastracion { get; set; }

    }
}
