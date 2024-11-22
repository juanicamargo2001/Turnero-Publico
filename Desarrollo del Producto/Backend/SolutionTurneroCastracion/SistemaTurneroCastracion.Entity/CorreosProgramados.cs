using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity
{
    public partial class CorreosProgramados
    {
        public long IdCorreo { get; set; }

        public DateTime FechaEnvio { get; set; }

        public string? Estado {  get; set; }

        public string EmailDestino { get; set; }

        public string NombreCompleto {  get; set; }

        public TimeSpan Hora { get; set; }

        public string CentroCastracion { get; set; }

        public string TipoAnimal { get; set; }

        public bool EsActivo { get; set; }

        public int IdHorario { get; set; }

        public virtual Horarios? Horarios { get; set; }



    }
}
