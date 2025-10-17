using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class CambioContraseñaDTO
    {
        public required string ContraseñaAnterior {  get; set; }

        public required string NuevaContraseña {  get; set; }


    }
}
