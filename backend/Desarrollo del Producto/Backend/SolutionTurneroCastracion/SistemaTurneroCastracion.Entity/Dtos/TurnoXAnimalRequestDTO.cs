using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class TurnoXAnimalRequestDTO
    {
        public int IdCentroCastracion { get; set; }

        public string TipoAnimal { get; set; }
    }
}
