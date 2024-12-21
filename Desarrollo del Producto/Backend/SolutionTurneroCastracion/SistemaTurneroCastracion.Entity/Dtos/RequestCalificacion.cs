using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class RequestCalificacion
    {
        [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5.")]
        public int NumeroCalifacion { get; set; }

        public string? Descripcion { get; set; }

        public int IdCentroCastracion { get; set; }
    }
}
