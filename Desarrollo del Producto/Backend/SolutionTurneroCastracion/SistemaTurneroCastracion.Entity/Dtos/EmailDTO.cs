using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class EmailDTO
    {
        public string? TipoEmail {  get; set; }

        public string Email { get; set; }

        public string Nombre { get; set; }

        public string CentroCastracion { get; set; }

        public string Fecha {  get; set; }

        public string Hora { get; set; }

        public string Tipo { get; set; }

        public string Mensaje { get; set; }

    }
}
