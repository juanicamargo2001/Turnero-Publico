using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public enum EstadoTurno
    {
        Libre,
        Reservado,
        Confirmado,
        Realizado,
        Cancelado,
        Ingresado,
        Fallido
    }
}
