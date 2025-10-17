using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class HorarioCentroParametroDTO
    {
        public int IdCentroCastracion {  get; set; }

        public int IdTurno {  get; set; }

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin {  get; set; }

        public int Cantidad { get; set; }

        public int IdTipoTurno { get; set; }

        public TimeSpan? InicioTrabajo { get; set; }

        public TimeSpan? FinTrabajo { get; set; }

    }
}
