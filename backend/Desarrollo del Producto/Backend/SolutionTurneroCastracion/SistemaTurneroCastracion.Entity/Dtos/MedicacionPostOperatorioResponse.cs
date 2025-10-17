using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class MedicacionPostOperatorioResponse
    {
        public string Medicamento { get; set; }

        public float Dosis { get; set; }

        public string UnidadMedida { get; set; }

        public string? Descripcion { get; set; }

        public string Sexo { get; set; }


    }
}
