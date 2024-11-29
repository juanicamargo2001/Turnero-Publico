using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class TurnosFiltradoSecretariaDTO
    {
        public long DNI { get; set; }

        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public long Telefono { get; set; }

        public string TipoServicio { get; set; }

        public int IdHorario { get; set; }

        public DateTime Dia {  get; set; }

        public TimeSpan? Hora { get; set; }

        public string Estado {  get; set; }

        public string? CentroCastracion {  get; set; }

    }
}
