using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record class TurnoUrgenteRequestDTO
    {
        public int IdUsuario { get; set; }

        public string? Sexo { get; set; }

        public int Edad {  get; set; }

        public string? TipoTamaño { get; set; }

        public string TipoAnimal {  get; set; }

        public string? Raza { get; set; }


    }
}
