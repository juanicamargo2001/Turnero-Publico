using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class CentroCastracionDTO
    {
        
        public string Nombre { get; set; }

        public string Barrio { get; set; }

        public string Calle { get; set; }

        public int Altura { get; set; }

        public bool Habilitado { get; set; }

        public List<Veterinario> Veterinarios { get; set; }
        
    }
}
