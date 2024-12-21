using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record RequestCancelacionesMasivas(DateTime DiaCancelacion, string Motivo, List<int> IdCentroCastracion);
}
