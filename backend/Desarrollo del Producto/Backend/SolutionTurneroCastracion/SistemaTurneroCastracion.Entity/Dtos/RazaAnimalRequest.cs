using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record RazaAnimalRequest
    {
        public string TipoAnimal { get; set; }

        public string AnimalBuscar { get; set; }
    }
}
