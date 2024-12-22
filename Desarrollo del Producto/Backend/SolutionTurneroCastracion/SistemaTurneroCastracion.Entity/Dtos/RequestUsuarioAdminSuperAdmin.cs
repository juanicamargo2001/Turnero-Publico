using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class RequestUsuarioAdminSuperAdmin
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public string Contraseña { get; set; }

        public string Email { get; set; }

    }
}
