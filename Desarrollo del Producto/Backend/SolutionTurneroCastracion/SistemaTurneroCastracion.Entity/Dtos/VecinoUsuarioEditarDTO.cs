using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class VecinoUsuarioEditarDTO
    {

        public string? Domicilio {  get; set; }

        public string? Email { get; set; }

        public long? Telefono { get; set; }
      

    }
}
