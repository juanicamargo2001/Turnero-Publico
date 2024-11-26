using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class SecretariaUsuarioDTO
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public string Contraseña { get; set; }

        public string Email {  get; set; }

        public int IdCentroCastracion { get; set; }

    }
}
