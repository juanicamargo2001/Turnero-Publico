using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class VecinoDTO
    {
        public DateTime F_nacimiento { get; set; }

        public string Domicilio { get; set; }

        public long Dni { get; set; }

        public string Email { get; set; }

        public long Telefono { get; set; }

        public List<MascotaDTO>? Mascotas { get; set; }
    }
}
