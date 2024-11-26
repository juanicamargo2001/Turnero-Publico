using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class TurnosSecretariaDTO
    {
        public DateTime FechaDesde {  get; set; }

        public DateTime? FechaHasta { get; set; }

        public TimeSpan HoraDesde { get; set; }

        public TimeSpan? HoraHasta { get; set; }

    }
}
