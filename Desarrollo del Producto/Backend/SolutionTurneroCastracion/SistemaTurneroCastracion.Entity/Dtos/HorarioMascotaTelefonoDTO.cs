using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class HorarioMascotaTelefonoDTO
    {
        public int IdTurnoHorario { get; set; }

        public int IdMascota { get; set; }

        public int IdUsuario { get; set; }
    }
}
