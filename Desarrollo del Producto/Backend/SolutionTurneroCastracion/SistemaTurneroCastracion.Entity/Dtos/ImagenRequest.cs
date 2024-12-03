using SistemaTurneroCastracion.Entity.Validaciones;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class ImagenRequest
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        [MinAge(18)]
        public DateTime F_Nacimiento { get; set; }

        public string? Domicilio { get; set; }

        [Dni]
        public long DNI { get; set; }

        public string Email { get; set; }

        public long Telefono { get; set; }

        public string Contraseña {  get; set; }

    }
}
