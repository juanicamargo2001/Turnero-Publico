using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record ResponseInformeCancelacion(int Cancelados, int Confirmados, int Total, float PorcentajeCancelados, float PorcentajeConfirmados);
    
}

